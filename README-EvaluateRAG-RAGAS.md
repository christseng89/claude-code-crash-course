# Evaluate RAG

## How to evaluate a RAG system?（RAG 系統評估指標）- RAGAS

**RAGAS**（Retrieval-Augmented Generation Assessment）是一個**專門用來評估 RAG 系統**的開源框架。
它能**自動化**計算多個關鍵指標，幫助開發者了解 RAG 系統哪個環節出了問題。

---

### RAGAS 的四大核心指標

| 指標 | 評估什麼 | 分數範圍 |
|------|----------|----------|
| **Faithfulness（忠實度）** | 回答是否完全基於檢索文件，沒有捏造 | 0～1 |
| **Answer Relevancy（答案相關性）** | 回答是否切中問題 | 0～1 |
| **Context Precision（上下文精確率）** | 檢索到的文件是否都與問題相關 | 0～1 |
| **Context Recall（上下文召回率）** | 標準答案所需資訊是否都在檢索結果中 | 0～1 |

---

#### RAGAS 評分結果

| 指標 | 分數 | 原因 |
|------|------|------|
| Faithfulness | **1.0** | 回答完全來自文件，沒有捏造 |
| Answer Relevancy | **0.95** | 回答切題，但少提了「前30天全薪」 |
| Context Precision | **1.0** | 檢索到的文件完全相關 |
| Context Recall | **0.7** | 標準答案中「全薪」資訊沒被納入回答 |

---

### RAGAS 使用流程

```md
準備測試資料集
（問題 + 標準答案）
        ↓
執行 RAG 系統
（取得檢索文件 + 生成回答）
        ↓
丟入 RAGAS 評估
        ↓
分析四大指標分數
        ↓
找出弱點並優化
（檢索？提示詞？Chunk大小？）
```

---

### 常見問題診斷對照

| 指標偏低 | 代表問題 | 解決方向 |
|----------|----------|----------|
| Faithfulness 低 | 模型在「亂說」 | **調整 Prompt**，要求**只依據文件回答** |
| Answer Relevancy 低 | 回答離題 | **改善問題理解**或 **Prompt 設計** |
| Context Precision 低 | 檢索到太多不相關文件 | **調整相似度閾值** 或 **Top-K 數量** |
| Context Recall 低 | **重要文件沒被找到** | **優化 Embedding 模型** 或 **Chunk 策略** |

---

RAGAS 最大優點是**不需要人工逐一打分**，可大規模自動評估，非常適合 RAG 系統的持續優化！

## RAGAS 是一個**開源 Python 套件（框架）**

---

### 準確定位

| 問題 | 答案 |
|------|------|
| 是軟件嗎？ | ✅ 廣義上是，它是一個**開源程式庫（Library）** |
| 是模型嗎？ | ❌ 不是，它本身不是 AI 模型 |
| 是框架嗎？ | ✅ 更精確地說，它是一個**評估框架（Evaluation Framework）** |

---

### 更完整的理解

```md
RAGAS
  = Python 套件
  + 評估指標算法
  + 內部調用 LLM（如 GPT-4）來執行評分
```

- 你用 `pip install ragas` 安裝它
- 它**本身不是模型**，但它會**呼叫外部 LLM**（例如 OpenAI GPT）來幫助計算分數
- 類似於：RAGAS 是「評審規則書」，LLM 是「評審員」

---

### 類比說明

| 角色 | 類比 |
|------|------|
| **RAGAS** | 考試評分標準（規則與框架） |
| **LLM（GPT等）** | 閱卷老師（實際執行判斷） |
| **你的 RAG 系統** | 參加考試的學生 |

---

### 總結

> **RAGAS = 開源 Python 評估套件**，定義了評估 RAG 系統的指標與方法，並借助 LLM 自動執行評分，**不是獨立的 AI 模型**。

## 使用 RAG 時，RAGAS 如何運作？

### 完整流程圖

```md
使用者提問
    ↓
RAG 系統執行（檢索 + 生成）
    ↓
收集三樣東西：
  1. 檢索到的文件（Context）
  2. 系統產生的回答（Answer）
  3. 標準答案（Ground Truth）
    ↓
丟入 RAGAS 自動評分
    ↓
輸出四大指標分數
```

---

### 具體實例：醫院病患問答系統

#### 第一步：使用者提問

> 「我服用阿斯匹靈有什麼副作用？」

#### 第二步：RAG 系統運作

**檢索到的文件（Context）：**
> 文件A：「阿斯匹靈常見副作用包括胃痛、噁心、出血風險增加。」  
> 文件B：「阿斯匹靈不建議兒童服用，可能引發雷氏症候群。」  
> 文件C：「止痛藥的歷史與發展…（不相關）」

**系統產生的回答（Answer）：**
> 「阿斯匹靈副作用包括胃痛、噁心，並增加出血風險。兒童不建議服用。」

**標準答案（Ground Truth）：**
> 「阿斯匹靈副作用有胃痛、噁心、出血風險，兒童服用可能引發雷氏症候群。」

---

#### 第三步：RAGAS 自動評分

| 指標 | 分數 | RAGAS 如何計算 |
|------|------|----------------|
| **Faithfulness** | 0.95 | 回答內容幾乎都來自文件A和B，沒捏造 |
| **Answer Relevancy** | 0.90 | 回答切題，但未提「雷氏症候群」名稱 |
| **Context Precision** | 0.67 | 3份文件中，文件C完全不相關（2/3相關） |
| **Context Recall** | 0.85 | 標準答案的重點大多有被檢索到 |

---

#### 第四步：開發者根據分數改進

| 問題發現 | 改進方向 |
|----------|----------|
| Context Precision 偏低（撈到不相關文件C） | 調高相似度閾值，減少 Top-K 數量 |
| Answer Relevancy 未到滿分 | 改善 Prompt，要求回答更完整 |

---

### 關鍵理解

```md
RAGAS 不介入 RAG 系統運作過程
它只在「事後」收集結果來評分
就像考試後的閱卷，不是考試中的輔導
```

> **重點：** RAGAS 是**離線評估工具**，在測試階段大量執行，幫助開發者持續改善 RAG 系統品質，正式上線後通常不會即時運行。
> RAGAS 的價值在於**持續優化**，而非**即時監控**。

## **RAG 負責「產生回答」，RAGAS 負責「事後評分」，開發者根據分數「持續改善」。**

---

### 完整循環圖

```md
使用者提問
    ↓
RAG 系統運作
（檢索文件 → LLM 生成回答）
    ↓
收集三樣資料：
  • 問題（Question）
  • 檢索文件（Context）
  • 系統回答（Answer）
  • 標準答案（Ground Truth）
    ↓
送入 RAGAS 評分
    ↓
觀察四大指標：
  • Faithfulness
  • Answer Relevancy
  • Context Precision
  • Context Recall
    ↓
發現問題 → 持續改善
（調整 Chunk、Prompt、檢索策略…）
    ↓
再次測試 → 再次評分 ♻️
```

---

### Python 程式碼範例

```python
import os
from langchain.text_splitter import CharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.vectorstores import FAISS
from langchain.chains import RetrievalQA
from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)
# ==========================================
# 設定 OpenAI API Key
# ==========================================
os.environ["OPENAI_API_KEY"] = "your-api-key-here"
# ==========================================
# 第一部分：建立 RAG 系統
# ==========================================
# 模擬醫療知識文件庫
documents = [
    """阿斯匹靈（Aspirin）常見副作用包括胃痛、噁心、消化不良。
    長期服用可能增加胃出血風險。兒童不建議服用，
    可能引發雷氏症候群（Reye's Syndrome）。""",
    """高血壓患者應定期監測血壓，建議維持在120/80 mmHg以下。
    治療方式包括藥物治療和生活方式調整，
    如減少鈉鹽攝取、規律運動、戒菸。""",
    """糖尿病患者需定期檢測血糖。第一型糖尿病需要胰島素治療，
    第二型糖尿病可透過飲食控制、運動及口服藥物管理。
    長期併發症包括腎病、視網膜病變和神經病變。""",
    """醫院資料治理政策應包含：患者隱私保護（HIPAA合規）、
    資料存取控制、資料加密、稽核日誌記錄、
    以及員工資料安全培訓。"""
]
# 文字切割
text_splitter = CharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=20
)
chunks = text_splitter.create_documents(documents)
# 建立向量資料庫
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)
# 建立 RAG 檢索鏈
llm = ChatOpenAI(model="gpt-4", temperature=0)
retriever = vectorstore.as_retriever(search_kwargs={"k": 2})
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)
# ==========================================
# 第二部分：準備測試問題集
# ==========================================
test_questions = [
    "阿斯匹靈有什麼副作用？",
    "高血壓患者應如何控制血壓？",
    "醫院應如何保護患者資料隱私？"
]
ground_truths = [
    "阿斯匹靈副作用包括胃痛、噁心、出血風險，兒童服用可能引發雷氏症候群。",
    "高血壓患者應維持血壓在120/80以下，透過藥物、減少鈉鹽、運動和戒菸管理。",
    "醫院應實施HIPAA合規、資料加密、存取控制、稽核日誌和員工培訓。"
]
# ==========================================
# 第三部分：執行 RAG 並收集結果
# ==========================================
questions = []
answers = []
contexts = []
truths = []
for question, truth in zip(test_questions, ground_truths):
    # RAG 系統產生回答
    result = qa_chain({"query": question})
    # 收集資料
    questions.append(question)
    answers.append(result["result"])
    contexts.append([doc.page_content
                     for doc in result["source_documents"]])
    truths.append(truth)
    print(f"問題：{question}")
    print(f"回答：{result['result']}")
    print("-" * 50)
# ==========================================
# 第四部分：送入 RAGAS 評估
# ==========================================
# 建立評估資料集
eval_dataset = Dataset.from_dict({
    "question": questions,
    "answer": answers,
    "contexts": contexts,
    "ground_truth": truths
})
# 執行 RAGAS 評估
print("\\n🔍 開始 RAGAS 評估...")
results = evaluate(
    eval_dataset,
    metrics=[
        faithfulness,        # 忠實度
        answer_relevancy,    # 答案相關性
        context_precision,   # 上下文精確率
        context_recall       # 上下文召回率
    ]
)
# ==========================================
# 第五部分：輸出評估報告
# ==========================================
print("\\n📊 RAGAS 評估結果：")
print("=" * 50)
print(f"忠實度    (Faithfulness):      {results['faithfulness']:.3f}")
print(f"答案相關性 (Answer Relevancy):  {results['answer_relevancy']:.3f}")
print(f"上下文精確 (Context Precision): {results['context_precision']:.3f}")
print(f"上下文召回 (Context Recall):    {results['context_recall']:.3f}")
print("=" * 50)
# 改善建議
print("\\n💡 改善建議：")
if results['faithfulness'] < 0.8:
    print("⚠️  忠實度偏低 → 調整 Prompt，要求只依據文件回答")
if results['answer_relevancy'] < 0.8:
    print("⚠️  答案相關性偏低 → 改善問題理解或 Prompt 設計")
if results['context_precision'] < 0.8:
    print("⚠️  上下文精確率偏低 → 減少 Top-K 數量或調高相似度閾值")
if results['context_recall'] < 0.8:
    print("⚠️  上下文召回率偏低 → 優化 Embedding 模型或 Chunk 策略")

```

### 這就是業界標準的 RAG 改善流程

| 階段 | 工具 | 目的 |
|------|------|------|
| 建立系統 | LangChain / LlamaIndex | 打造 RAG 系統 |
| 評估品質 | **RAGAS** | 自動量化各指標 |
| 持續優化 | 開發者根據指標調整 | 讓系統越來越好 |

---

### 補充：何時執行 RAGAS？

| 時機 | 說明 |
|------|------|
| **開發測試階段** | 大量執行，找出系統弱點 |
| **每次重大更新後** | 確認改動有正面效果 |
| **定期監控** | 偵測資料或環境變化導致的品質下降 |

> RAGAS => 🎉 是業界在實際部署 RAG 系統時的標準做法。
