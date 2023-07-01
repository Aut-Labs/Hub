export function getOwnerPhases(startDate: Date) {
  const phaseOneStartDate = startDate;

  const phaseOneDuration = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  const phaseTwoDuration = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  const phaseThreeDuration = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

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

  const phaseOneDuration = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  const phaseTwoDuration = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
  const phaseThreeDuration = 72 * 60 * 60 * 1000; // 72 hours in milliseconds

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
