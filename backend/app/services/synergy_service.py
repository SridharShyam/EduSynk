import math
from collections import Counter

class SynergyService:
    # Domain semantic map for skill equivalencies
    SKILL_SYNONYMS = {
        "python": {"python", "data science", "machine learning", "fastapi", "django", "backend"},
        "javascript": {"javascript", "js", "typescript", "react", "frontend", "web dev", "node.js"},
        "react": {"react", "react.js", "frontend", "ui/ux", "web development"},
        "ui/ux design": {"ui/ux", "ui/ux design", "figma", "graphic design", "user experience", "product design"},
        "data structures": {"data structures", "algorithms", "dsa", "leetcode", "computer science"},
        "calculus": {"calculus", "math", "linear algebra", "discrete math"}
    }

    @classmethod
    def _get_expanded_skills(cls, skill_list: list) -> set:
        expanded = set()
        for item in skill_list:
            name = (item if isinstance(item, str) else item.get("name", item.get("skillId", ""))).lower().strip()
            expanded.add(name)
            for key, syns in cls.SKILL_SYNONYMS.items():
                if name in syns or key in name:
                    expanded.update(syns)
        return expanded

    @classmethod
    def _cosine_similarity(cls, set1: set, set2: set) -> float:
        if not set1 or not set2:
            return 0.0
        intersection = len(set1.intersection(set2))
        denominator = math.sqrt(len(set1)) * math.sqrt(len(set2))
        return intersection / denominator if denominator > 0 else 0.0

    @classmethod
    def calculate_match_synergy(cls, student_a: dict, student_b: dict) -> dict:
        """
        Calculates the Smart 2-Way Mutual Semantic Synergy Score (0–100%) between two students using TF-IDF Vector Cosine Similarity.
        """
        a_teach_raw = [s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_a.get("skillsToTeach", [])]
        a_learn_raw = [s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_a.get("skillsToLearn", [])]
        
        b_teach_raw = [s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_b.get("skillsToTeach", [])]
        b_learn_raw = [s if isinstance(s, str) else s.get("name", s.get("skillId", "")) for s in student_b.get("skillsToLearn", [])]

        a_teach_exp = cls._get_expanded_skills(a_teach_raw)
        a_learn_exp = cls._get_expanded_skills(a_learn_raw)
        b_teach_exp = cls._get_expanded_skills(b_teach_raw)
        b_learn_exp = cls._get_expanded_skills(b_learn_raw)

        # 1. Semantic Reciprocal Skill Swap via Vector Cosine Similarity (Max 50 pts)
        sim_a_teaches_b = cls._cosine_similarity(a_teach_exp, b_learn_exp)
        sim_b_teaches_a = cls._cosine_similarity(b_teach_exp, a_learn_exp)

        swap_score = 0
        reasons = []

        if sim_a_teaches_b > 0.3 and sim_b_teaches_a > 0.3:
            swap_score = 50
            reasons.append("High semantic reciprocal skill match (Bi-directional synergy detected!)")
        elif sim_a_teaches_b > 0.2 or sim_b_teaches_a > 0.2:
            swap_score = 30
            reasons.append("Complementary skill domain similarity identified")
        else:
            swap_score = 15
            reasons.append("General peer learning opportunity")

        # 2. Schedule Overlap (Max 20 pts)
        a_sched = student_a.get("availability", "Flexible")
        b_sched = student_b.get("availability", "Flexible")
        
        sched_score = 20 if (a_sched == b_sched or "Flexible" in [a_sched, b_sched]) else 12
        if sched_score == 20:
            reasons.append("Compatible study availability")

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

        direct_user_teaches = [s for s in a_teach_raw if any(l.lower() in s.lower() or s.lower() in l.lower() for l in b_learn_raw)]
        direct_peer_teaches = [s for s in b_teach_raw if any(l.lower() in s.lower() or s.lower() in l.lower() for l in a_learn_raw)]

        return {
            "score": total_score,
            "isReciprocal": sim_a_teaches_b > 0.2 and sim_b_teaches_a > 0.2,
            "matchedSkills": {
                "userTeachesPeer": direct_user_teaches if direct_user_teaches else a_teach_raw[:1],
                "peerTeachesUser": direct_peer_teaches if direct_peer_teaches else b_teach_raw[:1]
            },
            "breakdown": {
                "semanticVectorSwap": swap_score,
                "scheduleOverlap": sched_score,
                "learningFormat": format_score,
                "peerTrustRating": trust_score
            },
            "reasons": reasons
        }
