import { ChevronRight } from 'lucide-react';
import React from 'react';

interface ButtonSopProps {
  title: string;
  buttonBg?: string;
  textColor?: string;
  icon?: React.ElementType;
  onPress?: () => void;
  targetBlank?: boolean;
  href?: string; // optional link
}

const PrimaryButton: React.FC<ButtonSopProps> = ({
  title,
  buttonBg = 'bg-primary',
  textColor = 'text-secondary',
  icon = ChevronRight,
  onPress,
  targetBlank = false,
  href,
}) => {
  const buttonContent = (
    <div className={`flex items-center justify-between w-[242px] h-[32px] ${buttonBg} rounded-[10px] py-5 pr-[20px] pl-[20px] cursor-pointer`}>
      <div className="mx-auto">
        <p className={`text-[16px] ${textColor} text-center`}>{title}</p>
      </div>
      <div className={`${textColor} h-[30px] w-[30px] flex items-center`}>
        {React.createElement(icon)}
      </div>
    </div>
  );

  if (targetBlank && href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {buttonContent}
      </a>
    );
  }

  return <button onClick={onPress}>{buttonContent}</button>;
};

export default PrimaryButton;
