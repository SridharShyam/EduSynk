import { 
  UserRepository, 
  SkillRepository, 
  ExchangeRepository, 
  MessageRepository, 
  SkillRequestRepository, 
  SafetyReportRepository 
} from '../repositories/index.js';

import { 
  UserService, 
  SkillService, 
  ExchangeService, 
  MessageService, 
  ReportService, 
  MatchingService 
} from '../services/index.js';
import { AIService } from '../services/AIService.js';
import { SearchService } from '../services/SearchService.js';

export class ServiceFactory {
  static createUserService() {
    return new UserService(new UserRepository());
  }

  static createSkillService() {
    return new SkillService(new SkillRepository(), new SkillRequestRepository());
  }

  static createExchangeService() {
    return new ExchangeService(new ExchangeRepository(), new UserRepository());
  }

  static createMessageService() {
    return new MessageService(new MessageRepository());
  }

  static createReportService() {
    return new ReportService(new SafetyReportRepository());
  }

  static createMatchingService() {
    return new MatchingService(new UserRepository());
  }

  static createAIService() {
    return new AIService();
  }

  static createSearchService() {
    return new SearchService(new UserRepository(), new SkillRepository());
  }
}

