import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';

interface IconButtonProps
  extends Pick<
    ButtonHTMLAttributes<HTMLButtonElement>,
    | 'aria-label'
    | 'disabled'
    | 'onBlur'
    | 'onClick'
    | 'onMouseDown'
    | 'onMouseLeave'
    | 'onMouseUp'
    | 'type'
  > {
  children: ReactNode;
}

const CustomButton: FC<IconButtonProps> = ({ children, ...props }) => {
  return (
    <button
      {...props}
      className="w-12 h-12 flex justify-center items-center rounded-md border border-sky-600 bg-slate-50 hover:bg-sky-100 disabled:bg-slate-300 disabled:border-slate-400"
    >
      {children}
    </button>
  );
};

export default CustomButton;
