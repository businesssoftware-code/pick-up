import React from 'react';

interface TopLineCardProps {
  minHeight?: string;
  width?: string;
  children: React.ReactNode;
  topColor?: string;
  childrenPadding?: string;
}

const TopLineCard: React.FC<TopLineCardProps> = ({
  minHeight = "min-h-[390px]",
  width = "min-w-[328px]",
  children,
  topColor = "bg-info", // <- set default 
  // here
  childrenPadding = "",
}) => {
  return (
    <div className={`${width} ${minHeight} flex flex-col  mt-2 rounded-[20px] overflow-hidden bg-white shadow-custom`}>
      {/* Top Color Line */}
      <div className={`w-full h-[20px] ${topColor}`} />
      
      {/* Content */}
      <div className={`flex-1 w-full flex flex-col ${childrenPadding}`}>
        {children}
      </div>
    </div>
  );
};

export default TopLineCard;
