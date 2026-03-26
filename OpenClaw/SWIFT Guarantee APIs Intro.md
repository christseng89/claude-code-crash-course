# SWIFT Guarantee APIs 簡介

---

## API 簡介

### 第一點：API 涵蓋Guarantee業務範圍

文件第 6 頁（Introduction）：

> "this API accommodates a wide range of guarantee types under the broader category of undertakings such as **Demand Guarantees, Standby Letters of Credit and Dependent Undertaking**."

---

### 第二點：API 只針對 Corporate ↔ Bank，銀行間仍用 MT Messages？

第 6 頁：
> "The C2B Bank Guarantees API is **limited to facilitating interactions between corporates and banks**. Interbank communications—such as those between the issuing bank and the advising bank—**continue to be conducted using MT messaging**."

第 14 頁也再次確認：
> "Category 7 MT messages continue to facilitate communication between the financial institutions involved."

---

### 小結

這個 C2B 定位也印證了前面分析的大方向：行業數字化的切入點是**企業與銀行之間的結構化連接**，而非替換整個銀行間報文基礎設施。

## Business Examples

### 一、Demand Guarantee（見索即付保函）

**法律性質：** 獨立於基礎合約，受益人只要提交符合保函條款的索賠聲明，開立行即須付款，**無需證明申請人確實違約**。

**規則依據：** URDG 758（ICC，2010）

**典型用途：**

- 工程履約保函（Performance Bond）
- 預付款保函（Advance Payment Guarantee）
- 投標保函（Bid Bond）

**關鍵特徵：**

- 通常由銀行開立
- 受益人為賣方/工程甲方等**非金融機構**
- 索賠文件極簡，通常僅需違約聲明書

---

### 二、Standby Letter of Credit（備用信用證，SBLC）

**法律性質：** 同樣獨立於基礎合約，結構上更接近跟單信用證，但用途是**備而不用**——只在申請人違約時才被動用。

**規則依據：** ISP98（ICC，1998）為主，也可適用 UCP 600

**典型用途：**

- 融資擔保（Financial Standby）
- 商業履約擔保（Performance Standby）
- 銀行對銀行的信用支持

**關鍵特徵：**

- 大量用於美國市場（因美國歷史上限制銀行開立傳統保函）
- 常涉及**銀行對銀行**的關係
- 格式語言更接近跟單信用證

---

### 三、Dependent Undertaking（從屬性承諾）

這是與前兩者**根本不同**的法律結構。

**法律性質：** **不獨立於基礎合約**，付款義務取決於基礎交易的實際履行情況。

**典型例子：**

- 傳統保證（Surety Bond / Guarantee）：受益人須先證明申請人確實違約，擔保人才須付款
- 共同連帶保證

**關鍵特徵：**

- 擔保人可援引申請人對受益人的抗辯（比如「貨物其實已交付」）
- 風險敞口相對較小，但對受益人的保障也較弱

---

### 三者對照表

| 維度 | Demand Guarantee | SBLC | Dependent Undertaking |
|---|---|---|---|
| 獨立性 | ✅ 完全獨立 | ✅ 完全獨立 | ❌ 從屬於基礎合約 |
| 主要規則 | URDG 758 | ISP98 / UCP 600 | 各地民法/擔保法 |
| 索賠難度 | 低（見索即付） | 低（見索即付） | 高（須舉證違約） |
| 典型市場 | 歐洲、中東、亞洲 | 美國、國際銀行間 | 英美 Surety 市場 |
| SWIFT API 適用 | ✅ | ✅ | ✅（納入 Undertaking API） |

---

### 為何 SWIFT API 把三者放在一起？

因為從**數字化生命週期管理**的角度看，三者都需要處理開立、修改、索賠、注銷等相同的業務流程節點，API 設計可以共用同一套框架，用 `demand_type` 等欄位區分具體類型即可。

這也是「Undertaking API」這個名稱比「Bank Guarantees API」更準確的原因——**Undertaking（承諾/保函）是涵蓋三者的中性術語**。
