export function convertToTerbilang(num: number): string {
  const satuan = [
    "", "Satu", "Dua", "Tiga", "Empat", "Lima",
    "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"
  ];

  const toWords = (n: number): string => {
    if (isNaN(n) || n === null || n === undefined) return "";
    if (n === 0) return "";
    if (n < 12) return satuan[n] || "";
    if (n < 20) return `${satuan[n - 10] || ""} Belas`.trim();
    if (n < 100)
      return `${satuan[Math.floor(n / 10)] || ""} Puluh ${toWords(n % 10)}`.trim();
    if (n < 200)
      return `Seratus ${toWords(n - 100)}`.trim();
    if (n < 1000)
      return `${satuan[Math.floor(n / 100)] || ""} Ratus ${toWords(n % 100)}`.trim();
    if (n < 2000)
      return `Seribu ${toWords(n - 1000)}`.trim();
    if (n < 1000000)
      return `${toWords(Math.floor(n / 1000))} Ribu ${toWords(n % 1000)}`.trim();
    if (n < 1000000000)
      return `${toWords(Math.floor(n / 1000000))} Juta ${toWords(n % 1000000)}`.trim();
    if (n < 1000000000000)
      return `${toWords(Math.floor(n / 1000000000))} Miliar ${toWords(n % 1000000000)}`.trim();
    if (n < 1000000000000000)
      return `${toWords(Math.floor(n / 1000000000000))} Triliun ${toWords(n % 1000000000000)}`.trim();
    return "Jumlah terlalu besar";
  };

  const hasil = toWords(Math.abs(num)).replace(/\s+/g, " ").trim();
  return hasil === "" ? "Nol" : hasil;
}
