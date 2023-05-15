export function getOwnerPhases() {
  const phaseOneStartDate = new Date("2023-05-16T07:00:00.000Z");
  // set the time zone to CET
  phaseOneStartDate.setUTCHours(7);
  phaseOneStartDate.setMinutes(0);
  phaseOneStartDate.setSeconds(0);
  phaseOneStartDate.setMilliseconds(0);

  const phaseOneDuration = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
  const phaseTwoDuration = 4 * 60 * 60 * 1000; // 4 hours in milliseconds
  const phaseThreeDuration = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

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

export function getMemberPhases() {
  const { phaseThreeEndDate: ownerPhaseThreeEndDate } = getOwnerPhases();

  const phaseOneDuration = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
  const phaseTwoDuration = 9 * 60 * 60 * 1000; // 9 hours in milliseconds
  const phaseThreeDuration = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

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
