export function getOwnerPhases(startDate: Date) {
  const phaseOneStartDate = startDate;
  // set the time zone to CET
  // phaseOneStartDate.setUTCHours(7);
  // phaseOneStartDate.setMinutes(0);
  // phaseOneStartDate.setSeconds(0);
  // phaseOneStartDate.setMilliseconds(0);

  const phaseOneDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  const phaseTwoDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
  const phaseThreeDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds

  const phaseOneEndDate = new Date(
    phaseOneStartDate.getTime() + phaseOneDuration
  );
  const phaseTwoStartDate = new Date(phaseOneEndDate.getTime());
  const phaseTwoEndDate = new Date(
    phaseTwoStartDate.getTime() + phaseTwoDuration
  );
  const phaseThreeStartDate = new Date(phaseTwoEndDate.getTime());
  const phaseThreeEndDate = new Date(
    phaseThreeStartDate.getTime() + phaseThreeDuration
  );

  return {
    phaseOneDuration,
    phaseTwoDuration,
    phaseThreeDuration,
    phaseOneStartDate,
    phaseOneEndDate,
    phaseTwoStartDate,
    phaseTwoEndDate,
    phaseThreeStartDate,
    phaseThreeEndDate
  };
}

export function getMemberPhases(startDate: Date) {
  const { phaseThreeEndDate: ownerPhaseThreeEndDate } =
    getOwnerPhases(startDate);

  const phaseOneDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
  const phaseTwoDuration = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
  const phaseThreeDuration = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

  const phaseOneStartDate = new Date(ownerPhaseThreeEndDate.getTime());
  const phaseOneEndDate = new Date(
    phaseOneStartDate.getTime() + phaseOneDuration
  );
  const phaseTwoStartDate = new Date(phaseOneEndDate.getTime());
  const phaseTwoEndDate = new Date(
    phaseTwoStartDate.getTime() + phaseTwoDuration
  );
  const phaseThreeStartDate = new Date(phaseTwoEndDate.getTime());
  const phaseThreeEndDate = new Date(
    phaseThreeStartDate.getTime() + phaseThreeDuration
  );

  return {
    phaseOneDuration,
    phaseTwoDuration,
    phaseThreeDuration,
    phaseOneStartDate,
    phaseOneEndDate,
    phaseTwoStartDate,
    phaseTwoEndDate,
    phaseThreeStartDate,
    phaseThreeEndDate
  };
}
