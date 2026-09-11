/**
 * Mock Speech Service Stub
 * Future integration point for Web Speech API / OpenAI Whisper Speech-to-Text.
 * Currently returns mock transcript streams for demonstration purposes.
 */

export const mockSpeechService = {
  /**
   * Stub function to start speech listening session.
   * @param {function} onTranscript Callback when speech is recognized
   */
  startListening: (onTranscript) => {
    console.log("[MockSpeechService] Initialized listener stub.");
  },

  /**
   * Stub function to stop speech listening session.
   */
  stopListening: () => {
    console.log("[MockSpeechService] Stopped listener stub.");
  }
};
