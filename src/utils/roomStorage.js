/**
 * FRIENDSHIP OS - Local Room & Participant Storage Utility
 * Manages unique temporary participant IDs (UUID) and room session credentials.
 */

export function getParticipantId() {
  let pid = sessionStorage.getItem("friendship_os_participant_id");
  if (!pid) {
    pid = typeof crypto !== 'undefined' && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `pid_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem("friendship_os_participant_id", pid);
  }
  return pid;
}

export function saveParticipantSession(roomCode, participantName, isCreator = false) {
  const pid = getParticipantId();
  sessionStorage.setItem("friendship_os_user_name", participantName);
  sessionStorage.setItem("friendship_os_active_room", roomCode);
  if (isCreator) {
    sessionStorage.setItem(`friendship_os_creator_${roomCode}`, 'true');
  }
  return { participantId: pid, name: participantName, isCreator };
}

export function getParticipantSession(roomCode) {
  const pid = getParticipantId();
  const name = sessionStorage.getItem("friendship_os_user_name") || "User";
  const isCreator = sessionStorage.getItem(`friendship_os_creator_${roomCode}`) === 'true';
  return { participantId: pid, name, isCreator };
}
