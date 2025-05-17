export const validateEmail = (email)=>{
    const regex =/^[^\$@]+@[^\$@]+\.[^\$@]+$/;
    return regex.test(email)
}

export const addThousandsSeperator = (num) => {
    if (num == null || isNaN(num)) return "";
  
    const [integerPart, fractionalPart] = num.toString().split(".");
    
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  
    return fractionalPart ? `${formattedInteger},${fractionalPart}` : formattedInteger;
  };
  
export const formatCurrency = (amount) => {
  if (amount == null || isNaN(amount)) return "₺0,00";
  
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
  