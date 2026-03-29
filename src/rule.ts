import type { DatabaseManagerInstance, LoggerService, ManagerConfig } from '@tazama-lf/frms-coe-lib';
import type { RuleConfig, RuleRequest, RuleResult } from '@tazama-lf/frms-coe-lib/lib/interfaces';
import { isPacs002Transaction, isBaseMessageTransaction } from '@tazama-lf/frms-coe-lib';

export type RuleExecutorConfig = Required<Pick<ManagerConfig, 'rawHistory' | 'eventHistory' | 'configuration' | 'localCacheConfig'>>;

export async function handleTransaction(
  req: RuleRequest,
  determineOutcome: (value: number, ruleConfig: RuleConfig, ruleResult: RuleResult) => RuleResult,
  ruleRes: RuleResult,
  loggerService: LoggerService,
  ruleConfig: RuleConfig,
  databaseManager: DatabaseManagerInstance<RuleExecutorConfig>,
): Promise<RuleResult> {
  
  if (!ruleConfig.config.bands) {
    throw new Error('Invalid config provided - bands not provided');
  }
  if (!ruleConfig.config.exitConditions) {
    throw new Error('Invalid config provided - exitConditions not provided');
  }
  if (!ruleConfig.config.parameters || typeof ruleConfig.config.parameters.tolerance != 'number') {
    throw new Error('Invalid config provided - tolerance parameter not provided or invalid type');
  }

const transaction = req.transaction;
    
        if (isBaseMessageTransaction(transaction)) {
            const payload = transaction.Payload as Record<string, unknown>;
            const amountRaw = payload.amount;
            if (typeof amountRaw !== 'number') {
                throw new Error('BaseMessage payload missing numeric storyamount.amount');
            }
            return determineOutcome(amountRaw, ruleConfig, ruleRes);
        }
    
    throw new Error('Unsupported transaction type: expected Pacs002 or BaseMessage');
  
}