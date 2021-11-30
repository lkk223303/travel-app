let fortunes = [
  "The love of your life is right in front of your eyes.",
  "Behind this fortune is the love of my life.",
  "You have a secret admirer.",
  "Love, because it is the only true adventure.",
];

exports.getFortune = () => {
  let idx = Math.floor(Math.random() * fortunes.length);
  return fortunes[idx];
};
