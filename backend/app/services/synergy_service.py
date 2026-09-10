class SynergyService:
    @staticmethod
    def calculate_match_synergy(student_a: dict, student_b: dict) -> dict:
        """
        Calculates the Smart 2-Way Mutual Synergy Score (0–100%) between two students.
        """
        # Normalize skill arrays
        a_teach = set(s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_a.get("skillsToTeach", []))
        a_learn = set(s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_a.get("skillsToLearn", []))
        
        b_teach = set(s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_b.get("skillsToTeach", []))
        b_learn = set(s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_b.get("skillsToLearn", []))
        
        # 1. Reciprocal Skill Swap (Max 45 pts)
        a_teaches_b = bool(a_teach.intersection(b_learn))
        b_teaches_a = bool(b_teach.intersection(a_learn))
        
        swap_score = 0
        reasons = []
        
        if a_teaches_b and b_teaches_a:
            swap_score = 45
            reasons.append("Perfect reciprocal skill match (You teach what they need, they teach what you need!)")
        elif a_teaches_b or b_teaches_a:
            swap_score = 25
            reasons.append("1-Way skill complement identified")
        else:
            swap_score = 10
            reasons.append("General skill swap opportunity")
            
        # 2. Schedule Overlap (Max 25 pts)
        a_sched = student_a.get("availability", "Flexible")
        b_sched = student_b.get("availability", "Flexible")
        
        sched_score = 25 if (a_sched == b_sched or "Flexible" in [a_sched, b_sched]) else 15
        if sched_score == 25:
            reasons.append("Highly compatible study schedules")
            
        # 3. Format Preference (Max 15 pts)
        a_fmt = student_a.get("learningFormat", "Online")
        b_fmt = student_b.get("learningFormat", "Online")
        
        format_score = 15 if (a_fmt == b_fmt or "Hybrid" in [a_fmt, b_fmt]) else 10
        if format_score == 15:
            reasons.append(f"Matching learning style ({a_fmt})")
            
        # 4. Peer Trust Rating (Max 15 pts)
        b_rep = student_b.get("reputationScore", 90)
        trust_score = min(15, round((b_rep / 100) * 15))
        if trust_score >= 13:
            reasons.append(f"High peer reputation score ({b_rep}/100)")
            
        total_score = min(100, swap_score + sched_score + format_score + trust_score)
        
        return {
            "score": total_score,
            "isReciprocal": a_teaches_b and b_teaches_a,
            "matchedSkills": {
                "userTeachesPeer": list(a_teach.intersection(b_learn)),
                "peerTeachesUser": list(b_teach.intersection(a_learn))
            },
            "breakdown": {
                "reciprocalSwap": swap_score,
                "scheduleOverlap": sched_score,
                "learningFormat": format_score,
                "peerTrustRating": trust_score
            },
            "reasons": reasons
        }
