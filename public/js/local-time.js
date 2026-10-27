const formatter = new Intl.DateTimeFormat('sv-SE', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

document.querySelectorAll('time[datetime]').forEach((el) => {
  el.textContent = formatter.format(new Date(el.dateTime));
});
