const FitnessLogo = ({ className = "", textColor = "text-foreground" }: { className?: string; textColor?: string }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img 
        src="/lovable-uploads/deff32ce-7e44-4c1b-8c5f-3e5b49f3b7db.png" 
        alt="Fitness Friends Logo" 
        className="w-10 h-10"
      />
      <span className={`text-xl font-bold ${textColor}`}>Fitness Friends</span>
    </div>
  );
};

export default FitnessLogo;