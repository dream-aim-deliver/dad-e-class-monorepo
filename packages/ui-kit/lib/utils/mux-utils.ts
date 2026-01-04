/**
 * Parses a videoId that may contain an embedded token for signed playback.
 * @param videoId - Input in format "playbackId" or "playbackId?token=jwt"
 * @returns Separated playbackId and playbackToken
 * @example
 * parseVideoId("abc123") // { playbackId: "abc123", playbackToken: undefined }
 * parseVideoId("abc123?token=eyJ...") // { playbackId: "abc123", playbackToken: "eyJ..." }
 */
export const parseVideoId = (videoId: string | undefined): {
    playbackId: string | undefined;
    playbackToken: string | undefined;
} => {
    if (!videoId) return { playbackId: undefined, playbackToken: undefined };

    const tokenMatch = videoId.match(/^([^?]+)\?token=(.+)$/);
    if (tokenMatch) {
        return {
            playbackId: tokenMatch[1],
            playbackToken: tokenMatch[2],
        };
    }
    return { playbackId: videoId, playbackToken: undefined };
};
