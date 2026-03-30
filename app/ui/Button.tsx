
interface Props {
    children: React.ReactNode
    variant?: 'primary' | 'secondary'    
    onClick?: () => void
    className?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
}

function Button({children, variant = 'primary', onClick, className, type = 'button', disabled}: Props) {

  const baseStyle = `font-inter w-full py-3 flex justify-center rounded-xl active:scale-[0.98] transition-all duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`

  const variants = {
    primary: "bg-black text-white",
    secondary: "bg-white text-black",
  }
  return (    
    <button
        type={type}
        disabled={disabled}
        onClick={onClick} 
        className={`${className || ''} ${baseStyle} ${variants[variant]}`}>
        {children}
    </button>
  )
}

export default Button;