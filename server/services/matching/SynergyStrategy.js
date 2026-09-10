export class SynergyMatchingStrategy {
  calculateSynergy(studentA, studentB) {
    const idA = studentA?.userId || studentA?.id;
    const idB = studentB?.userId || studentB?.id;
    if (!studentA || !studentB || idA === idB) {
      return { score: 0, isMutual: false, breakdown: [] };
    }

    // Read formula weights from environment variables
    const RECIPROCAL_PTS = Number(process.env.MATCH_SYNERGY_RECIPROCAL_POINTS) || 45;
    const TEACH_ONLY_PTS = Number(process.env.MATCH_SYNERGY_TEACH_ONLY_POINTS) || 25;
    const LEARN_ONLY_PTS = Number(process.env.MATCH_SYNERGY_LEARN_ONLY_POINTS) || 25;
    const SCHEDULE_PTS = Number(process.env.MATCH_SYNERGY_SCHEDULE_POINTS) || 25;
    const FORMAT_PTS = Number(process.env.MATCH_SYNERGY_FORMAT_POINTS) || 15;
    const TRUST_HIGH_PTS = Number(process.env.MATCH_SYNERGY_TRUST_HIGH_POINTS) || 15;
    const TRUST_MID_PTS = Number(process.env.MATCH_SYNERGY_TRUST_MID_POINTS) || 10;
    const TRUST_LOW_PTS = Number(process.env.MATCH_SYNERGY_TRUST_LOW_POINTS) || 5;

    let totalScore = 0;
    const breakdown = [];

    // 1. Direct Reciprocal Skill Swap
    const aTeachesB = studentA.teachSkills?.some(ts => 
      studentB.learnSkills?.some(ls => ls.skillId === ts.skillId)
    );
    const bTeachesA = studentB.teachSkills?.some(ts => 
      studentA.learnSkills?.some(ls => ls.skillId === ts.skillId)
    );

    if (aTeachesB && bTeachesA) {
      totalScore += RECIPROCAL_PTS;
      breakdown.push({ label: 'Perfect 2-Way Skill Swap', points: RECIPROCAL_PTS, icon: 'repeat' });
    } else if (aTeachesB) {
      totalScore += TEACH_ONLY_PTS;
      breakdown.push({ label: 'Teaches Skill You Want to Learn', points: TEACH_ONLY_PTS, icon: 'book-open' });
    } else if (bTeachesA) {
      totalScore += LEARN_ONLY_PTS;
      breakdown.push({ label: 'Wants Skill You Teach', points: LEARN_ONLY_PTS, icon: 'award' });
    }

    // 2. Availability Overlap
    if (studentA.availability === studentB.availability || studentA.availability === 'Flexible Schedule' || studentB.availability === 'Flexible Schedule') {
      totalScore += SCHEDULE_PTS;
      breakdown.push({ label: 'Compatible Schedule', points: SCHEDULE_PTS, icon: 'calendar' });
    } else {
      totalScore += 10;
      breakdown.push({ label: 'Partial Schedule Overlap', points: 10, icon: 'clock' });
    }

    // 3. Learning Format Preference
    if (studentA.preferredFormat === studentB.preferredFormat || studentA.preferredFormat === 'Hybrid' || studentB.preferredFormat === 'Hybrid') {
      totalScore += FORMAT_PTS;
      breakdown.push({ label: 'Matching Format Preference', points: FORMAT_PTS, icon: 'video' });
    } else {
      totalScore += 5;
      breakdown.push({ label: 'Format Adaptable', points: 5, icon: 'check' });
    }

    // 4. Peer Trust Bonus
    const avgRep = ((studentA.reputationScore || 95) + (studentB.reputationScore || 95)) / 2;
    if (avgRep >= 95) {
      totalScore += TRUST_HIGH_PTS;
      breakdown.push({ label: 'High Peer Trust Badge', points: TRUST_HIGH_PTS, icon: 'shield-check' });
    } else if (avgRep >= 90) {
      totalScore += TRUST_MID_PTS;
      breakdown.push({ label: 'Verified Peer Activity', points: TRUST_MID_PTS, icon: 'check-circle' });
    } else {
      totalScore += TRUST_LOW_PTS;
      breakdown.push({ label: 'Active Student Member', points: TRUST_LOW_PTS, icon: 'user-check' });
    }

    return {
      score: Math.min(100, totalScore),
      isMutual: Boolean(aTeachesB && bTeachesA),
      breakdown
    };
  }
}
