interface InitialsAvatarProps {
  initials: string;
  color: string;
  size?: 'sm' | 'md';
}

export function InitialsAvatar({ initials, color, size = 'sm' }: InitialsAvatarProps) {
  const sizeClass = size === 'md' ? 'w-14 h-14 text-base' : 'w-9 h-9 text-xs';
  return (
    <div
      className={`${sizeClass} rounded-lg flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
}
