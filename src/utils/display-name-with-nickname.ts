export function hasDistinctDisplayName(displayName: string, nickname: string) {
  return nickname && displayName !== nickname;
}

export default function displayNameWithNickname(
  displayName: string,
  nickname: string
) {
  return hasDistinctDisplayName(displayName, nickname)
    ? `${displayName} (${nickname})`
    : displayName;
}
