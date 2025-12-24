
export function numberToWords(num: number): string {
  if (isNaN(num) || num === null) return 'Zero Rupees only';
  
  const totalAmount = Math.round(num);
  if (totalAmount === 0) return 'Zero Rupees only';

  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const formatTrio = (n: number) => {
    let str = '';
    if (n > 99) {
      str += a[Math.floor(n / 100)] + 'Hundred ';
      n %= 100;
    }
    if (n > 19) {
      str += b[Math.floor(n / 10)] + ' ' + a[n % 10];
    } else {
      str += a[n];
    }
    return str;
  };

  let res = '';
  let n = totalAmount;

  if (n > 9999999) {
    res += formatTrio(Math.floor(n / 10000000)) + 'Crore ';
    n %= 10000000;
  }
  if (n > 99999) {
    res += formatTrio(Math.floor(n / 100000)) + 'Lakh ';
    n %= 100000;
  }
  if (n > 999) {
    res += formatTrio(Math.floor(n / 1000)) + 'Thousand ';
    n %= 1000;
  }
  res += formatTrio(n);

  return res.trim() + ' Rupees only';
}
