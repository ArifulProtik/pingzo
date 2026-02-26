import { IconChartBubbleFilled } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';

type LogoProps = {
  size?: number;
  text: string;
};

const Logo = ({ size = 22, text }: LogoProps) => {
  return (
    <Link to="/">
      <div className="flex items-center gap-2">
        <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
          <IconChartBubbleFilled size={size} />
        </div>
        <p className="font-bold">{text}</p>
      </div>
    </Link>
  );
};

export default Logo;
