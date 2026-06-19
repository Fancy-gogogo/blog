---
title: "为什么 90% 的 LLM + 本体项目会失败"
date: 2026-06-18
draft: false
tags: ["Ontology"]
description: "这是 90% LLM + 本体项目失败的根本原因。听起来像管理问题，但其实是架构问题——架构决定了团队怎么组织、业务怎么参与、失败怎么发生"
---

> 把本体当 LLM 补丁是死路

2024 到 2026 年，几乎所有"严肃"的 LLM 企业项目都会加一个东西：本体（ontology）。会议 PPT 里会画这样的图——底层 LLM，上面挂一层 ontology，右边再挂 RAG、tools、agents。看起来很完整。

但你看不到的是：**这些项目里 90% 不会真正上线**。要么 demo 完就死，要么 POC 完被推翻，要么上线了但没人用。

失败的原因不是 LLM 不够强，不是 ontology 太难建，也不是 RAG 不够准。**根因更根本：方向搞反了**。行业里把 ontology 当 LLM 的补丁——"给 LLM 加个 grounding 层"。这个方向是错的。

正确方向是反过来：**让 LLM 在 ontology 的世界里工作**。LLM 不是主角，本体才是。LLM 只是 ontology 这个操作系统上的一个应用。

这个差别听起来抽象，但实际决定项目生死。

## 一、补丁模式（错误）和世界模式（正确）的本质区别

**补丁模式**的核心假设：

> LLM 是主体，ontology 是给 LLM 加的辅助。"我们有个 LLM，但需要 grounding，所以我们加了 ontology。"

这个假设里：
- LLM 是一等公民
- ontology 是 LLM 的一个特性（"我们支持 ontology-grounded responses"）
- ontology 的存在是为了让 LLM 更好
- 如果 LLM 已经够好，ontology 可以去掉

**世界模式**的核心假设：

> ontology 是世界，LLM 是这个世界里的一个工具。"我们有一个企业 ontology 定义了什么是客户、什么是订单、什么是续约。LLM 是一种交互方式，让用户用自然语言操作这个 ontology。"

这个假设里：
- ontology 是一等公民（不是 LLM 的特性，是 LLM 操作的对象）
- LLM 是 ontology 的一个接口（"我们用 LLM 让 ontology 更易用"）
- ontology 的存在是独立的——它有自己的 schema、自己的实例、自己的生命周期
- 去掉 LLM，ontology 仍然在（只不过要写 SQL 才能用）

**一个简单测试**：你的项目是哪种？问自己——"如果 LLM 没了，这个项目还在吗？"

- 答案"还在" → 世界模式（ontology 独立，LLM 是其中一种用法）
- 答案"没了" → 补丁模式（ontology 依附于 LLM，离开 LLM 啥也不是）

90% 的项目答"没了"。**这就是它们会失败的根因**。

## 二、补丁模式为什么必然失败

补丁模式失败有 3 个具体的结构原因。

**原因 1：ontology 永远建不全**

补丁模式把 ontology 当 LLM 的"事实库"。问题是：**LLM 的需求是无界的**。用户问什么，ontology 就要有什么。ontology 建 30 个实体、50 个关系，LLM 用户一句"我们供应商的备品备件库存怎么样"就能问到 ontology 没覆盖的领域。

补丁模式下的应对是"加实体"——但加永远追不上问。ontology 团队陷入永远在扩展 schema 的泥潭，开发永远在补 grounding prompt，业务永远在抱怨"问不到我想问的"。

世界模式下的应对是"接受 ontology 是不完整的"——ontology 只覆盖核心实体（占查询的 80%），剩下 20% 用 RAG + LLM 通用知识补。这不是妥协，是**正确的架构**。

**原因 2：ontology 团队和 LLM 团队目标分裂**

补丁模式组织上长这样：

- ontology 团队（数据治理、知识图谱背景）——目标是"建好 ontology"
- LLM 团队（NLP、ML 背景）——目标是"做出能用的 agent"
- 两个团队各做各的，最后 hardcode 一些 interface 拼一起

这种组织结构下，ontology 团队按"知识图谱完整性"标准建（OWL、推理规则、TransitiveProperty），LLM 团队按"demo 能跑"标准做（prompt engineering、function calling）。两边的工作度量、节奏、目标都对不上。最后交付的是"勉强能拼"的 demo，不是"真正能跑"的系统。

世界模式下，ontology 团队不存在。**只有"业务 ontology + 多个执行引擎"团队**。LLM 是执行引擎之一。团队目标对齐：把 ontology 跑通，所有执行引擎都受益。

**原因 3：业务方不认 ontology**

补丁模式从业务方视角看是这样：

> "AI 团队说他们用 ontology 让 AI 更准。但我不知道 ontology 是啥，我也不关心。给我 demo 看效果就行。"

业务方对 ontology 没有承诺。ontology 出问题，业务方不会帮忙修——"那是 AI 团队的事"。

世界模式从业务方视角看是这样：

> "我们公司在数据治理时定义了一套 ontology——客户怎么算、订单怎么流转、MQL 到 SQL 的标准是什么。AI 只是这套治理的延伸。"

业务方对 ontology **有承诺**——因为 ontology 是他们定义的（不是 AI 团队定义的）。ontology 出问题，业务方主动修——因为这是他们的数据治理。

**世界模式的 ontology 是治理工具的延伸**。补丁模式的 ontology 是 AI 团队的工具。两种 ontology 看起来一样，但治理承诺完全不同。

## 三、那 LLM 在世界模式里干什么？

LLM 不是没了，是**重新定位**。

世界模式下，LLM 的工作分 3 块：

**1. 自然语言接口**
让用户用自然语言操作 ontology。"我客户 ABC 的 ARR 是多少"——LLM 翻译成 ontology 查询。用户不学 Cypher、不学 SQL。

**2. 知识补全**
当 ontology 没覆盖某个领域，LLM 用通用知识兜底。"我们行业最近的并购情况"——ontology 里没有并购实体，LLM 调 RAG + 训练知识回答。**用户明确知道这是"AI 推断"，不是"ontology 事实"**。

**3. ontology 维护**
LLM 在对话中发现新概念/新关系，建议加到 ontology（人工审核）。LLM 是 ontology 的"雷达"——发现业务在用本体里没的概念，提示出来。

**LLM 不是 ontology 的"加料"，是 ontology 的"用户界面 + 维护助手"**。

## 四、一个案例对比：补丁模式 vs 世界模式

两家企业的项目对比（脱敏）：

**项目 A**（补丁模式）：
- LLM 团队主导，3 个月搭出 demo
- ontology 是"为了 grounding 加的"，由 1 个数据治理同事半兼职维护
- demo 效果惊艳，业务方鼓掌
- 上线 1 个月，问题爆发：用户问的 60% 超出 ontology 覆盖
- ontology 同事被催扩展 schema，加不动
- 4 个月后项目搁置

**项目 B**（世界模式）：
- 业务方主导，ontology 是"数据治理项目"，已经迭代 2 年
- LLM 团队后期加入，定位"让 ontology 更易用的工具"
- 业务方对 ontology 有承诺——这是他们的数据治理
- 上线 1 个月，80% 查询命中 ontology 核心；剩下 20% LLM 兜底并提示
- 持续运转，ontology 因为 LLM 反馈新概念在持续增长

**两边的差距不在技术——在 ontology 是 AI 的事还是业务的事**。

## 五、怎么判断自己的项目是哪种

5 个问题，对的越多越危险：

1. ontology 是不是"为了 LLM 性能"才建的？
2. ontology 团队和 LLM 团队是分开的吗？
3. 业务方能说出 ontology 里 5 个核心实体吗？
4. 去掉 LLM，ontology 还在运转吗？
5. ontology schema 变更，业务方有审批权吗？

如果 4-5 个答案是"是"——世界模式，稳。
如果 0-1 个答案是"是"——补丁模式，**3 个月内会出问题**。

## 六、如果已经掉进补丁模式，怎么救

不是没救，但要承认现实：

1. **承认 ontology 是 AI 的补丁**——别装"业务在治理 ontology"
2. **缩小 ontology 范围**——只覆盖最核心 10-15 个实体，别想"完整 ontology"
3. **接受 ontology 永远不完整**——80% 查询命中 + 20% LLM 兜底，是稳态
4. **分离"ontology 事实"和"AI 推断"**——回答里明确标"这是 ontology 数据"vs"这是 AI 推断"
5. **让 LLM 团队开始做 ontology 维护**——他们是 schema 最大的客户，必须参与

最关键的：**别让 ontology 团队背着"完整 ontology"的 KPI**。他们会被压垮，项目会被拖死。

## 总结

LLM + 本体的真正分水岭不是"ontology 多大"、"LLM 多强"、"RAG 多准"——是**ontology 和 LLM 谁是主体**。

把 ontology 当 LLM 补丁——项目会失败，因为 ontology 永远建不全，团队永远分裂，业务永远不认账。

让 LLM 在 ontology 的世界里工作——项目能跑通，因为 ontology 独立运转，LLM 只是 UI 之一，业务方有承诺。


