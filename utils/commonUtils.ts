export const handleNextPage = (page: number, totalPages: number, setPage: React.Dispatch<React.SetStateAction<number>>) => {
  if (page < totalPages) {
    setPage(page + 1);
  }
};

export const handlePrevPage = (page: number, setPage: React.Dispatch<React.SetStateAction<number>>) => {
  if (page > 1) {
    setPage(page - 1);
  }
};

export const numberWithCommas = (number: { toLocaleString?: () => any }) => {
  if (number && number.toLocaleString) {
    return number.toLocaleString();
  }
  return '';
};

export const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const [{ value: month }, , { value: day }, , { value: year }, ,
    { value: hour }, , { value: minute }
  ] = formatter.formatToParts(date);

  return `${year}/${month}/${day} ${hour}:${minute}`;
};