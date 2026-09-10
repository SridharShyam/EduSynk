export class SearchService {
  constructor(userRepository, skillRepository) {
    this.userRepository = userRepository;
    this.skillRepository = skillRepository;

    // English <-> Tamil skill alias dictionary
    this.aliasMap = {
      'python': ['python', 'பைதான்'],
      'பைதான்': ['python', 'பைதான்'],
      'javascript': ['javascript', 'js', 'ஜாவாஸ்கிரிப்ட்'],
      'ஜாவாஸ்கிரிப்ட்': ['javascript', 'js', 'ஜாவாஸ்கிரிப்ட்'],
      'react': ['react', 'react.js', 'ரியாக்ட்'],
      'ரியாக்ட்': ['react', 'react.js', 'ரியாக்ட்'],
      'ui/ux': ['ui/ux', 'ui', 'ux', 'design', 'வடிவமைப்பு', 'யுஐ/யுஎக்ஸ்'],
      'வடிவமைப்பு': ['ui/ux', 'design', 'graphic design', 'வடிவமைப்பு'],
      'data science': ['data science', 'analytics', 'தரவு அறிவியல்'],
      'தரவு அறிவியல்': ['data science', 'analytics', 'தரவு அறிவியல்'],
      'machine learning': ['machine learning', 'ml', 'ai', 'இயந்திர கற்றல்'],
      'இயந்திர கற்றல்': ['machine learning', 'ml', 'ai', 'இயந்திர கற்றல்'],
      'cybersecurity': ['cybersecurity', 'security', 'சைபர் பாதுகாப்பு'],
      'சைபர் பாதுகாப்பு': ['cybersecurity', 'security', 'சைபர் பாதுகாப்பு'],
      'digital marketing': ['digital marketing', 'marketing', 'டிஜிட்டல் மார்க்கெட்டிங்'],
      'டிஜிட்டல் மார்க்கெட்டிங்': ['digital marketing', 'marketing', 'டிஜிட்டல் மார்க்கெட்டிங்'],
      'public speaking': ['public speaking', 'communication', 'பொதுப் பேச்சு'],
      'பொதுப் பேச்சு': ['public speaking', 'communication', 'பொதுப் பேச்சு'],
      'graphic design': ['graphic design', 'design', 'கிராஃபிக் டிசைன்'],
      'கிராஃபிக் டிசைன்': ['graphic design', 'design', 'கிராஃபிக் டிசைன்']
    };
  }

  /**
   * Search students and skills across MongoDB database
   */
  async search({ query = '', category = '', format = '', page = 1, limit = 10 }) {
    const term = query.trim().toLowerCase();

    // Determine query terms including aliases
    let searchTerms = [term];
    if (this.aliasMap[term]) {
      searchTerms = Array.from(new Set([...searchTerms, ...this.aliasMap[term]]));
    }

    // Build regex pattern for any matching alias
    const regexPattern = searchTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    const regex = new RegExp(regexPattern, 'i');

    const allUsers = await this.userRepository.findAll();

    let results = allUsers.filter(u => {
      // Filter out passwords
      delete u.password;

      // Text match across fields
      const matchesName = regex.test(u.name || '');
      const matchesUniversity = regex.test(u.university || '');
      const matchesMajor = regex.test(u.major || '');
      const matchesBio = regex.test(u.bio || '');

      const teachSkills = u.skillsToTeach || [];
      const learnSkills = u.skillsToLearn || [];

      const matchesTeach = teachSkills.some(s =>
        regex.test(s.name || s.skillId || '') || regex.test(s.category || '') || (s.tags || []).some(t => regex.test(t))
      );

      const matchesLearn = learnSkills.some(s =>
        regex.test(s.name || s.skillId || '') || regex.test(s.category || '') || (s.tags || []).some(t => regex.test(t))
      );

      const matchesQuery = !query || matchesName || matchesUniversity || matchesMajor || matchesBio || matchesTeach || matchesLearn;

      // Category filter
      let matchesCategory = true;
      if (category) {
        const catLower = category.toLowerCase();
        matchesCategory = teachSkills.some(s => (s.category || '').toLowerCase() === catLower) ||
                          learnSkills.some(s => (s.category || '').toLowerCase() === catLower);
      }

      // Learning format filter
      let matchesFormat = true;
      if (format && format !== 'All') {
        matchesFormat = u.preferredFormat === format || u.preferredFormat === 'Hybrid' || format === 'Hybrid';
      }

      return matchesQuery && matchesCategory && matchesFormat;
    });

    const total = results.length;
    const startIndex = (page - 1) * limit;
    const paginatedResults = results.slice(startIndex, startIndex + limit);

    return {
      results: paginatedResults,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit) || 1
      },
      searchTerms
    };
  }
}
