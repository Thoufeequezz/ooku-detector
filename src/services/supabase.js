import { createClient } from '@supabase/supabase-js';
import { getParticipantId } from '../utils/roomStorage';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase = isSupabaseConfigured
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

// Local fallback keys for cross-tab multi-window execution
const LOCAL_ROOMS_KEY = "friendship_os_rooms_v4";
const LOCAL_MESSAGES_KEY = "friendship_os_messages_v4";
const LOCAL_EVENTS_KEY = "friendship_os_events_v4";
const LOCAL_MEMBERS_KEY = "friendship_os_members_v4";

const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel("friendship_os_realtime_v4")
  : null;

function getLocalData(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

function setLocalData(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Storage write error:", e);
  }
}

export function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "KMEA";
  for (let i = 0; i < 3; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * CREATE ROOM
 */
export async function createRoom(creatorName) {
  const roomCode = generateRoomCode();
  const participantId = getParticipantId();
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .insert([{
          room_code: roomCode,
          created_by_participant: participantId,
          is_active: true
        }])
        .select()
        .single();

      if (roomError) throw roomError;

      await supabase
        .from('room_members')
        .insert([{
          room_id: room.id,
          participant_id: participantId,
          name: creatorName,
          joined_at: timestamp,
          is_active: true
        }]);

      return { roomCode, roomId: room.id, participantId, createdBy: creatorName };
    } catch (err) {
      console.warn("Supabase createRoom error, using fallback:", err);
    }
  }

  // Fallback storage
  const rooms = getLocalData(LOCAL_ROOMS_KEY);
  const roomId = `room_${Date.now()}`;
  const memberObj = { id: `m_${Date.now()}`, participant_id: participantId, name: creatorName, joined_at: timestamp };
  
  rooms[roomCode] = {
    id: roomId,
    room_code: roomCode,
    created_by_participant: participantId,
    created_at: timestamp,
    is_active: true,
    created_by: creatorName
  };
  setLocalData(LOCAL_ROOMS_KEY, rooms);

  const members = getLocalData(LOCAL_MEMBERS_KEY);
  members[roomCode] = [memberObj];
  setLocalData(LOCAL_MEMBERS_KEY, members);

  return { roomCode, roomId, participantId, createdBy: creatorName };
}

/**
 * JOIN ROOM
 */
export async function joinRoom(roomCode, userName) {
  const formattedCode = roomCode.trim().toUpperCase();
  const participantId = getParticipantId();
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select()
        .eq('room_code', formattedCode)
        .single();

      if (roomError || !room) {
        return { success: false, error: "Room not found. Check the code and try again." };
      }

      if (!room.is_active) {
        return { success: false, error: "This room has already ended." };
      }

      const { data: existing } = await supabase
        .from('room_members')
        .select()
        .eq('room_id', room.id)
        .eq('participant_id', participantId);

      let memberObj = { participant_id: participantId, name: userName, joined_at: timestamp };

      if (!existing || existing.length === 0) {
        const { data: inserted } = await supabase
          .from('room_members')
          .insert([{
            room_id: room.id,
            participant_id: participantId,
            name: userName,
            joined_at: timestamp,
            is_active: true
          }])
          .select()
          .single();
        
        if (inserted) memberObj = inserted;
      }

      return { success: true, roomCode: formattedCode, roomId: room.id, participantId };
    } catch (err) {
      console.warn("Supabase joinRoom error, using fallback:", err);
    }
  }

  // Fallback storage
  const rooms = getLocalData(LOCAL_ROOMS_KEY);
  const room = rooms[formattedCode];

  if (!room) {
    return { success: false, error: "Room not found. Check the code and try again." };
  }

  if (!room.is_active) {
    return { success: false, error: "This room has already ended." };
  }

  const members = getLocalData(LOCAL_MEMBERS_KEY);
  if (!members[formattedCode]) members[formattedCode] = [];

  const existingMember = members[formattedCode].find(m => m.participant_id === participantId);
  const newMemberObj = { id: `m_${Date.now()}_${Math.random().toString(36).substring(2,7)}`, participant_id: participantId, name: userName, joined_at: timestamp };

  if (!existingMember) {
    members[formattedCode].push(newMemberObj);
    setLocalData(LOCAL_MEMBERS_KEY, members);

    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'NEW_MEMBER_JOINED',
        member: newMemberObj,
        roomCode: formattedCode
      });
    }
  }

  return { success: true, roomCode: formattedCode, roomId: room.id, participantId };
}

/**
 * SEND MESSAGE
 */
export async function sendMessage(roomCode, senderName, messageText) {
  const formattedCode = roomCode.trim().toUpperCase();
  const participantId = getParticipantId();
  const timestamp = new Date().toISOString();

  if (isSupabaseConfigured && supabase) {
    try {
      let roomId = null;
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_code', formattedCode)
        .maybeSingle();

      if (existingRoom) {
        roomId = existingRoom.id;
      } else {
        const { data: newRoom } = await supabase
          .from('rooms')
          .insert([{
            room_code: formattedCode,
            created_by_participant: participantId,
            is_active: true
          }])
          .select()
          .single();
        if (newRoom) roomId = newRoom.id;
      }

      if (roomId) {
        const { data: msg, error: msgErr } = await supabase
          .from('messages')
          .insert([{
            room_id: roomId,
            participant_id: participantId,
            sender_name: senderName,
            message: messageText
          }])
          .select()
          .single();

        if (msgErr) {
          console.warn("Supabase insert message error:", msgErr);
        } else if (msg) {
          return msg;
        }
      }
    } catch (err) {
      console.warn("Supabase sendMessage error, falling back:", err);
    }
  }

  // Fallback storage with BroadcastChannel
  const allMessages = getLocalData(LOCAL_MESSAGES_KEY);
  if (!allMessages[formattedCode]) allMessages[formattedCode] = [];

  const newMsg = {
    id: `msg_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
    room_code: formattedCode,
    participant_id: participantId,
    sender_name: senderName,
    message: messageText,
    created_at: timestamp
  };

  allMessages[formattedCode].push(newMsg);
  setLocalData(LOCAL_MESSAGES_KEY, allMessages);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'NEW_MESSAGE', message: newMsg, roomCode: formattedCode });
  }

  return newMsg;
}

/**
 * RECORD OOKU EVENT
 */
export async function recordOokuEvent(roomCode, eventData) {
  const formattedCode = roomCode.trim().toUpperCase();
  const participantId = getParticipantId();
  const damage = eventData.damage || (Number(eventData.intensity) || 5) * 10;
  const confidence = eventData.confidence || 0.90;

  if (isSupabaseConfigured && supabase) {
    try {
      let roomId = null;
      const { data: existingRoom } = await supabase
        .from('rooms')
        .select('id')
        .eq('room_code', formattedCode)
        .maybeSingle();

      if (existingRoom) {
        roomId = existingRoom.id;
      }

      if (roomId) {
        const { data: event, error: eventErr } = await supabase
          .from('ooku_events')
          .insert([{
            room_id: roomId,
            message_id: eventData.message_id || null,
            participant_id: participantId,
            sender_name: eventData.speaker,
            target_name: eventData.target,
            type: eventData.type,
            intensity: eventData.intensity,
            confidence: confidence,
            damage: damage
          }])
          .select()
          .single();

        if (eventErr) {
          console.warn("Supabase recordOokuEvent insert error:", eventErr);
        } else if (event) {
          return {
            ...event,
            speaker: event.sender_name,
            target: event.target_name,
            isOoku: true
          };
        }
      }
    } catch (err) {
      console.warn("Supabase recordOokuEvent error:", err);
    }
  }

  const allEvents = getLocalData(LOCAL_EVENTS_KEY);
  if (!allEvents[formattedCode]) allEvents[formattedCode] = [];

  const newEvent = {
    id: `event_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
    room_code: formattedCode,
    message_id: eventData.message_id || null,
    participant_id: participantId,
    speaker: eventData.speaker,
    target: eventData.target,
    type: eventData.type,
    intensity: eventData.intensity,
    confidence: confidence,
    damage: damage,
    isOoku: true,
    created_at: new Date().toISOString()
  };

  allEvents[formattedCode].push(newEvent);
  setLocalData(LOCAL_EVENTS_KEY, allEvents);

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'NEW_OOKU_EVENT', event: newEvent, roomCode: formattedCode });
  }

  return newEvent;
}

/**
 * FETCH INITIAL ROOM DETAILS (Chronologically sorted by created_at ASC)
 */
export async function fetchRoomDetails(roomCode) {
  const formattedCode = roomCode.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      const { data: room, error: roomError } = await supabase
        .from('rooms')
        .select(`
          id,
          room_code,
          created_by_participant,
          is_active,
          room_members ( participant_id, name, joined_at ),
          messages ( id, room_id, participant_id, sender_name, message, created_at ),
          ooku_events ( id, room_id, message_id, participant_id, sender_name, target_name, type, intensity, created_at )
        `)
        .eq('room_code', formattedCode)
        .single();

      if (room && !roomError) {
        const sortedMsgs = (room.messages || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const sortedEvents = (room.ooku_events || []).sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

        return {
          roomId: room.id,
          roomCode: formattedCode,
          createdByParticipant: room.created_by_participant,
          isActive: room.is_active,
          members: (room.room_members || []).map(m => ({ id: m.participant_id, name: m.name })),
          messages: sortedMsgs,
          ookuEvents: sortedEvents.map(e => ({
            ...e,
            speaker: e.sender_name,
            target: e.target_name,
            isOoku: true
          }))
        };
      }
    } catch (err) {
      console.warn("Supabase fetchRoomDetails error:", err);
    }
  }

  const rooms = getLocalData(LOCAL_ROOMS_KEY);
  const room = rooms[formattedCode] || { id: `room_${formattedCode}`, created_by_participant: "", is_active: true };
  const members = getLocalData(LOCAL_MEMBERS_KEY)[formattedCode] || [];
  const rawMessages = getLocalData(LOCAL_MESSAGES_KEY)[formattedCode] || [];
  const rawEvents = getLocalData(LOCAL_EVENTS_KEY)[formattedCode] || [];

  const sortedMsgs = [...rawMessages].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));
  const sortedEvents = [...rawEvents].sort((a, b) => new Date(a.created_at || 0) - new Date(b.created_at || 0));

  return {
    roomId: room.id || `room_${formattedCode}`,
    roomCode: formattedCode,
    createdByParticipant: room.created_by_participant,
    isActive: room.is_active,
    members: members.map(m => ({ id: m.participant_id, name: m.name })),
    messages: sortedMsgs,
    ookuEvents: sortedEvents
  };
}

/**
 * SUBSCRIBE TO REALTIME ROOM MESSAGES & EVENTS
 */
export function subscribeToRoom(roomCode, roomId, onMessage, onMemberJoin, onEvent, onRoomEnd) {
  const formattedCode = roomCode.trim().toUpperCase();
  let channel = null;

  if (isSupabaseConfigured && supabase) {
    const channelName = roomId ? `room_channel_${roomId}` : `room_channel_${formattedCode}`;
    const msgOpts = { event: 'INSERT', schema: 'public', table: 'messages' };
    const memberOpts = { event: 'INSERT', schema: 'public', table: 'room_members' };
    const eventOpts = { event: 'INSERT', schema: 'public', table: 'ooku_events' };
    const roomOpts = { event: 'UPDATE', schema: 'public', table: 'rooms' };

    if (roomId) {
      msgOpts.filter = `room_id=eq.${roomId}`;
      memberOpts.filter = `room_id=eq.${roomId}`;
      eventOpts.filter = `room_id=eq.${roomId}`;
      roomOpts.filter = `id=eq.${roomId}`;
    }

    channel = supabase
      .channel(channelName)
      .on('postgres_changes', msgOpts, payload => {
        if (!roomId || payload.new.room_id === roomId) {
          if (onMessage) onMessage(payload.new);
        }
      })
      .on('postgres_changes', memberOpts, payload => {
        if (!roomId || payload.new.room_id === roomId) {
          if (onMemberJoin) onMemberJoin(payload.new);
        }
      })
      .on('postgres_changes', eventOpts, payload => {
        if (!roomId || payload.new.room_id === roomId) {
          if (onEvent) onEvent({ 
            ...payload.new, 
            speaker: payload.new.sender_name, 
            target: payload.new.target_name, 
            isOoku: true 
          });
        }
      })
      .on('postgres_changes', roomOpts, payload => {
        if (!payload.new.is_active) {
          if (onRoomEnd) onRoomEnd();
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to realtime room ${formattedCode} (ID: ${roomId})`);
        }
      });
  }

  const handleBroadcast = (e) => {
    if (!e.data || e.data.roomCode !== formattedCode) return;
    if (e.data.type === 'NEW_MESSAGE' && onMessage) {
      onMessage(e.data.message);
    }
    if (e.data.type === 'NEW_MEMBER_JOINED' && onMemberJoin) {
      onMemberJoin(e.data.member);
    }
    if (e.data.type === 'NEW_OOKU_EVENT' && onEvent) {
      onEvent(e.data.event);
    }
    if (e.data.type === 'ROOM_ENDED' && onRoomEnd) {
      onRoomEnd();
    }
  };

  const handleStorageChange = (e) => {
    if (e.key === LOCAL_MESSAGES_KEY) {
      const allMsgs = getLocalData(LOCAL_MESSAGES_KEY)[formattedCode] || [];
      if (allMsgs.length > 0 && onMessage) {
        const latest = allMsgs[allMsgs.length - 1];
        onMessage(latest);
      }
    }
    if (e.key === LOCAL_MEMBERS_KEY) {
      const members = getLocalData(LOCAL_MEMBERS_KEY)[formattedCode] || [];
      if (members.length > 0 && onMemberJoin) {
        const latest = members[members.length - 1];
        onMemberJoin(latest);
      }
    }
  };

  if (broadcastChannel) {
    broadcastChannel.addEventListener('message', handleBroadcast);
  }
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageChange);
  }

  return () => {
    if (channel && supabase) {
      supabase.removeChannel(channel);
    }
    if (broadcastChannel) {
      broadcastChannel.removeEventListener('message', handleBroadcast);
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange);
    }
  };
}

/**
 * END ROOM SESSION
 */
export async function endRoomSession(roomCode) {
  const formattedCode = roomCode.trim().toUpperCase();

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase
        .from('rooms')
        .update({ is_active: false, ended_at: new Date().toISOString() })
        .eq('room_code', formattedCode);
    } catch (err) {
      console.warn("Supabase endRoomSession error:", err);
    }
  }

  const rooms = getLocalData(LOCAL_ROOMS_KEY);
  if (rooms[formattedCode]) {
    rooms[formattedCode].is_active = false;
    setLocalData(LOCAL_ROOMS_KEY, rooms);
  }

  if (broadcastChannel) {
    broadcastChannel.postMessage({ type: 'ROOM_ENDED', roomCode: formattedCode });
  }
}
