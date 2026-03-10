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
