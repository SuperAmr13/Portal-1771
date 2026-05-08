export function getSeat(power, settings) {
  const goldLimit = settings?.gold_limit || 80000000;
  const purpleLimit = settings?.purple_limit || 60000000;
  const blueLimit = settings?.blue_limit || 40000000;

  const p = Number(power || 0);
  if (p >= goldLimit) return "Gold";
  if (p >= purpleLimit) return "Purple";
  if (p >= blueLimit) return "Blue";
  return "White";
}
