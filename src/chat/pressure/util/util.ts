/**
 * 
 */

import { RateAwardCfg, WeightAwardCfg } from '../xls/awardCfg.s';
import { getMap } from './cfgMap';
import { RandomSeedMgr } from './randomSeedMgr';

// 获取任务
export const getTask = (num: number, seedMgr: RandomSeedMgr) => {
    const weights = [];
    let maxWeigth = 0;
    const filterCfgs = [];
    const cfgs = getCfg(WeightAwardCfg._$info.name);
    const cfg = cfgs.get(num);
    if (!cfg) return;
    const count = cfg.count;
    filterCfgs.push(cfg);
    weights.push(maxWeigth += cfg.weight);
    for (let i = 1; i < count; i++) {
        const cfg2 = cfgs.get(num + i);
        filterCfgs.push(cfg2);
        weights.push(maxWeigth += cfg2.weight);
    }
    const i = getWeightIndex(weights, seedMgr.seed);

    return filterCfgs[i];
};

// 获取权重对应的位置
const getWeightIndex = (weights: number[], seed: number) => {
    const rate = RandomSeedMgr.randomSeed(seed, 1, weights[weights.length - 1]);

    let i = 0;
    for (i = 0; i < weights.length; i++) {
        if (rate <= weights[i]) break;
    }

    return i;
};

/**
 * 读取配置
 * id作为主键
 * 返回map
 */
export const getCfg = (name: string): Map<any, any> => {
    const cfgs = getMap(name);
    const r = new Map();
    for (const value of cfgs.values()) {
        r.set(value.id, value);
    }

    return r;
};
