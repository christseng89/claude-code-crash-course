# Compliance Check Guidance for Banking Operations

**Document Version:** 1.0
**Effective Date:** February 2026
**Review Cycle:** Annual
**Owner:** Compliance Department

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Regulatory Framework](#regulatory-framework)
3. [Domestic Remittances Compliance](#domestic-remittances-compliance)
4. [International Remittances Compliance](#international-remittances-compliance)
5. [Letter of Credit (LC) Compliance](#letter-of-credit-lc-compliance)
6. [Letter of Guarantee (LG) Compliance](#letter-of-guarantee-lg-compliance)
7. [Common Compliance Controls](#common-compliance-controls)
8. [Escalation and Reporting](#escalation-and-reporting)
9. [Appendices](#appendices)

---

## Executive Summary

This document provides comprehensive compliance check guidance for three core banking operations:
- **Domestic and International Remittances** - Fund transfer services
- **Letters of Credit (LC)** - Trade finance instruments
- **Letters of Guarantee (LG)** - Performance and financial guarantees

**Compliance Objectives:**
- Prevent money laundering and terrorist financing (AML/CFT)
- Ensure sanctions compliance (OFAC, UN, EU, local)
- Meet regulatory reporting requirements
- Protect bank reputation and operational integrity
- Maintain customer due diligence (CDD/KYC) standards

**Risk Rating Framework:**
- **Low Risk:** Standard processing, automated checks
- **Medium Risk:** Enhanced monitoring, manual review
- **High Risk:** Senior approval, detailed investigation

---

## Regulatory Framework

### International Standards
- **FATF Recommendations** - Financial Action Task Force 40+9 Recommendations
- **Basel Committee** - Sound Management of Risks Related to Money Laundering
- **Wolfsberg Principles** - Anti-Money Laundering Guidance for Correspondent Banking
- **UCP 600** - Uniform Customs and Practice for Documentary Credits (Letters of Credit)
- **URDG 758** - Uniform Rules for Demand Guarantees (Letters of Guarantee)

### Key Regulations by Jurisdiction

| Jurisdiction | Primary Regulations |
|-------------|-------------------|
| **United States** | Bank Secrecy Act (BSA), USA PATRIOT Act, OFAC Sanctions, FinCEN Rules |
| **European Union** | 5th Anti-Money Laundering Directive (5AMLD), GDPR, MiFID II |
| **United Kingdom** | Money Laundering Regulations 2017, Proceeds of Crime Act 2002 |
| **Hong Kong** | Anti-Money Laundering and Counter-Terrorist Financing Ordinance |
| **Singapore** | Monetary Authority of Singapore (MAS) Notices 626, 824 |
| **UAE** | Central Bank AML/CFT Regulations, DFSA Rules |

### Internal Compliance Standards
- Bank's AML/CFT Policy (latest version)
- Sanctions Screening Policy
- Customer Due Diligence (CDD) Manual
- Transaction Monitoring Guidelines
- Suspicious Activity Reporting (SAR) Procedures

---

## Domestic Remittances Compliance

### Scope
Domestic remittances include all fund transfers between accounts within the same country, typically processed through:
- Domestic wire transfers (RTGS, ACH, SWIFT domestic)
- Inter-bank transfers
- Same-bank account transfers
- Mobile/digital wallet transfers

### Pre-Transaction Checks

#### 1. Customer Identification and Verification (CIV)

**Individual Customers:**
```
✓ Valid government-issued photo ID verified
✓ Current residential address confirmed
✓ Tax identification number (TIN/SSN) validated
✓ Biometric verification (if applicable)
✓ Customer risk rating assessed
```

**Corporate Customers:**
```
✓ Certificate of incorporation verified
✓ Business registration/license confirmed
✓ Beneficial ownership structure documented (≥25% ownership)
✓ Ultimate Beneficial Owner (UBO) identified
✓ Authorized signatories validated
✓ Board resolution for banking relationship (if required)
```

**Checklist Reference:** See Appendix A - KYC Documentation Matrix

#### 2. Account Status Verification

```
✓ Sender account active and in good standing
✓ Recipient account valid and operational
✓ No account restrictions or freezes
✓ Account ownership confirmed
✓ Dormant account reactivation completed (if applicable)
```

#### 3. Transaction Purpose and Source of Funds

**Mandatory Information:**
- Purpose of remittance (salary, business payment, family support, investment, etc.)
- Source of funds verification (employment income, business revenue, sale proceeds, etc.)
- Supporting documentation (invoice, contract, salary slip, etc.)

**Enhanced Due Diligence Triggers:**
- Transaction amount > [Threshold: e.g., USD 50,000 or local equivalent]
- Unusual transaction pattern for customer profile
- High-risk customer segment (PEP, cash-intensive business)
- First-time large remittance

**Documentation Requirements:**
| Transaction Type | Required Documents |
|-----------------|-------------------|
| Salary Payment | Employment contract, payroll records |
| Supplier Payment | Invoice, purchase order, contract |
| Loan Repayment | Loan agreement, repayment schedule |
| Investment | Investment agreement, prospectus |
| Gift/Donation | Declaration letter, relationship proof |

#### 4. Sanctions Screening

**Screening Protocol:**
```
STAGE 1: Automated screening against:
  ✓ OFAC Specially Designated Nationals (SDN) List
  ✓ UN Consolidated Sanctions List
  ✓ EU Sanctions List
  ✓ Local jurisdiction sanctions lists
  ✓ Bank's internal watchlist

STAGE 2: Name matching algorithm:
  ✓ Exact match - BLOCK transaction immediately
  ✓ High confidence match (>95%) - Manual review required
  ✓ Medium confidence match (80-95%) - Enhanced review
  ✓ Low confidence match (<80%) - Document and proceed with caution

STAGE 3: False positive resolution:
  ✓ Compare full name, date of birth, address
  ✓ Check additional identifiers (passport number, etc.)
  ✓ Document resolution rationale
  ✓ Obtain Compliance Officer approval
```

**Screening Entities:**
- Sender (individual or corporate)
- Recipient (individual or corporate)
- Beneficial owners (if corporate)
- Intermediary parties (if applicable)

**Real-Time Screening:** All transactions must be screened before execution. No exceptions.

#### 5. Transaction Monitoring Rules

**Automated Rule Engine:**

| Rule ID | Rule Description | Threshold | Action |
|---------|-----------------|-----------|--------|
| DRM-001 | Single transaction amount | > USD 50,000 | Alert for review |
| DRM-002 | Cumulative daily transactions | > USD 100,000 | Alert for review |
| DRM-003 | Multiple small transactions (structuring) | >10 txns < USD 10,000 | High priority alert |
| DRM-004 | Round-number transactions | Exact multiples of 10,000 | Flag for pattern analysis |
| DRM-005 | Rapid movement of funds | Credits + debits within 24h | Flag for review |
| DRM-006 | Unusual counterparty | First-time recipient > USD 20,000 | Enhanced review |
| DRM-007 | High-risk geography | High-risk jurisdiction per FATF | Mandatory review |

**Behavioral Analysis:**
- Deviation from customer's historical transaction pattern
- Sudden increase in transaction frequency or volume
- Transactions inconsistent with customer's stated business/employment
- Use of account by third parties

### Transaction Execution Checks

#### 6. Regulatory Reporting

**Cash Transaction Reporting (CTR):**
- **Threshold:** Transactions involving cash equivalent > USD 10,000 (or local equivalent)
- **Filing Deadline:** Within 15 days of transaction
- **Responsible Party:** Compliance Officer
- **System:** Automated CTR generation from core banking system

**Suspicious Activity Reporting (SAR):**
- **Trigger:** Any transaction displaying suspicious characteristics
- **Filing Deadline:** Within 30 days of detection
- **Confidentiality:** Must not inform customer of SAR filing
- **Documentation:** Maintain detailed investigation notes

**Large Transaction Reporting (LTR):**
- **Threshold:** Per local regulatory requirements (e.g., > USD 100,000)
- **Filing Deadline:** As per jurisdiction (typically monthly/quarterly)

#### 7. Approval Workflow

| Transaction Amount | Approval Authority | Additional Requirements |
|-------------------|-------------------|------------------------|
| < USD 10,000 | System Auto-Approval | All automated checks passed |
| USD 10,000 - 50,000 | Branch Manager/Team Lead | Purpose verification |
| USD 50,001 - 250,000 | Compliance Officer | Enhanced due diligence |
| > USD 250,000 | Head of Compliance + Senior Management | Detailed investigation report |

**High-Risk Transaction Protocol:**
- Any transaction flagged as high-risk requires manual approval
- Approval must include documented rationale
- Additional verification steps mandatory

#### 8. Record Keeping

**Retention Period:** Minimum 5 years (or per local regulation, whichever is longer)

**Mandatory Records:**
```
✓ Transaction authorization form
✓ Customer identification documents
✓ Source of funds documentation
✓ Sanctions screening results
✓ Approval trail (electronic signatures)
✓ Communication logs (email, phone notes)
✓ Investigation reports (if applicable)
✓ Regulatory reports filed (CTR, SAR, LTR)
```

**Storage:** Secure, encrypted, access-controlled system with audit trail

### Post-Transaction Monitoring

#### 9. Ongoing Monitoring

**Daily Activities:**
- Review overnight transaction alerts
- Investigate flagged transactions
- Update customer risk ratings (if needed)
- Escalate suspicious activities

**Weekly Activities:**
- Trend analysis of high-value transactions
- Review of pending alerts and investigations
- Sanctions list update verification

**Monthly Activities:**
- Compliance dashboard review
- Alert effectiveness analysis (false positive rate)
- Staff training on new typologies

#### 10. Quality Assurance

**Quarterly Reviews:**
- Sample testing of transaction approvals (minimum 5% of high-value transactions)
- Sanctions screening accuracy assessment
- Documentation completeness audit

**Annual Reviews:**
- Full policy and procedure review
- Independent audit by Internal Audit
- Regulatory compliance self-assessment

### Red Flags for Domestic Remittances

⚠️ **Immediate Escalation Required:**
1. Customer refuses to provide transaction purpose or source of funds
2. Transaction involves sanctioned individual/entity (exact or high confidence match)
3. Structuring behavior detected (multiple transactions just below reporting threshold)
4. Funds transferred immediately to high-risk jurisdiction
5. Customer admits funds are for illegal purpose
6. Law enforcement inquiry received
7. Transaction involves known shell company or front operation
8. Customer provides false or misleading information
9. Unusual urgency without legitimate business reason
10. Third-party funding with unclear relationship

⚠️ **Enhanced Monitoring Required:**
1. Large cash deposit followed by immediate wire transfer
2. Transactions inconsistent with customer profile (occupation, business type)
3. Frequent changes in beneficiary details
4. Round-number transactions (e.g., exactly USD 50,000)
5. Customer reluctant to provide additional documentation
6. Business account used for personal transactions (or vice versa)
7. Multiple accounts used for same transaction pattern
8. Transactions with newly opened accounts
9. Geographic anomalies (customer location vs. transaction destination)
10. High-value transactions from dormant accounts

---

## International Remittances Compliance

### Scope
International remittances include all cross-border fund transfers, typically processed through:
- International wire transfers (SWIFT MT103, MT202)
- Correspondent banking networks
- Money transfer operators (MTOs)
- Digital cross-border payment platforms

### Additional Complexity Factors
- **Multi-Jurisdiction Compliance:** Must comply with regulations in sender country, recipient country, and all intermediary countries
- **Correspondent Bank Requirements:** Must meet due diligence requirements of correspondent banks
- **Exchange Control Regulations:** Must comply with foreign exchange rules
- **Trade-Based Money Laundering (TBML):** Higher risk due to cross-border nature

### Pre-Transaction Checks (Additional to Domestic)

#### 11. Enhanced Customer Due Diligence (EDD)

**Mandatory EDD Scenarios:**
- Any transaction to/from high-risk jurisdiction (per FATF grey/black lists)
- Transaction involving Politically Exposed Person (PEP)
- Transaction amount > USD 100,000 (or local equivalent threshold)
- Customer from high-risk country or sector

**EDD Requirements:**
```
✓ Senior management approval obtained
✓ Source of wealth documented (not just source of funds)
✓ Enhanced background checks completed
✓ Adverse media screening conducted
✓ Ongoing monitoring frequency increased (weekly vs. monthly)
✓ In-person interview conducted (for PEPs and high-risk customers)
```

**PEP Definition:** Includes:
- Senior government officials (past or present)
- Military leaders
- State-owned enterprise executives
- Political party officials
- Immediate family members (spouse, children, parents)
- Close associates (business partners, advisors)

**PEP Approval:** Requires approval from Compliance Officer AND Head of Branch/Region

#### 12. Geographic Risk Assessment

**Country Risk Rating Matrix:**

| Risk Level | Characteristics | Examples | Compliance Requirements |
|-----------|----------------|----------|------------------------|
| **Prohibited** | International sanctions | North Korea, Iran (comprehensive sanctions) | BLOCK all transactions |
| **High Risk** | FATF blacklist, weak AML controls | Myanmar, Uganda, Yemen | EDD + Senior approval |
| **Medium Risk** | FATF greylist, emerging AML framework | Turkey, UAE, Pakistan | Enhanced monitoring |
| **Low Risk** | Strong regulatory framework | US, UK, EU, Singapore | Standard processing |

**Risk Rating Updates:** Monthly (based on FATF updates and bank intelligence)

**Data Sources:**
- FATF public statements
- Basel AML Index
- Transparency International Corruption Perceptions Index
- World Bank Governance Indicators
- Internal bank intelligence and typology analysis

#### 13. Correspondent Banking Due Diligence

**Pre-Execution Verification:**
```
✓ Correspondent bank is on approved list
✓ Correspondent relationship is active and current
✓ No adverse information about correspondent bank
✓ Correspondent bank's AML/CFT policies reviewed (annual)
✓ SWIFT BIC code verified
```

**Correspondent Bank Requirements:**
- Must have robust AML/CFT program
- Must be licensed and regulated in home jurisdiction
- Must not be shell bank or operate in jurisdiction allowing shell banks
- Must cooperate with regulatory inquiries

**Nested Banking Prohibition:** Correspondent bank must certify it does not provide correspondent services to shell banks

#### 14. Sanctions Screening (Enhanced)

**Additional Screening Requirements for International:**

```
STAGE 1: Expanded entity screening:
  ✓ Sender, recipient, beneficiary (as per domestic)
  ✓ Correspondent bank(s)
  ✓ Intermediary bank(s)
  ✓ All parties mentioned in payment details
  ✓ Ordering institution and beneficiary institution

STAGE 2: Geographic screening:
  ✓ Originating country
  ✓ Destination country
  ✓ All transit/correspondent countries
  ✓ Beneficiary business location(s)

STAGE 3: Product/service screening:
  ✓ Check if transaction involves sanctioned goods/services
  ✓ Dual-use goods (can be used for civilian or military purposes)
  ✓ Luxury goods (if applicable to sanctions regime)
```

**SWIFT Message Screening:**
- Screen all fields of SWIFT MT103 message (F20, F23B, F32A, F50K, F52A, F56A, F57A, F59, F70, F71A, F72)
- Flag any field containing sanctioned entities, addresses, or vessels
- Check narrative fields (F70) for prohibited transaction descriptions

#### 15. Payment Purpose and Documentation

**Prohibited Purposes:**
- Ransom payments
- Purchases from sanctioned entities
- Illegal gambling
- Arms trade (without appropriate licenses)
- Human trafficking
- Drug trafficking
- Terrorism financing

**High-Risk Purposes Requiring Enhanced Checks:**
- Charitable donations (terrorism financing risk)
- Real estate transactions (money laundering risk)
- High-value goods (art, jewelry, vehicles)
- Business investments in high-risk jurisdictions
- Loan repayments to offshore entities

**Documentation Requirements:**

| Transaction Purpose | Required Documents | Verification Steps |
|--------------------|-------------------|-------------------|
| Trade Payment (Import) | Commercial invoice, bill of lading, purchase order | Verify goods match customer business, check pricing reasonableness |
| Trade Payment (Export) | Commercial invoice, shipping documents, export license (if applicable) | Confirm export declaration, verify recipient business legitimacy |
| Foreign Investment | Investment agreement, regulatory approval (if required), source of funds | Verify investment destination, check for shell companies |
| Property Purchase | Sales agreement, property valuation, legal documentation | Confirm property exists, verify seller identity |
| Tuition/Education | Admission letter, fee invoice from educational institution | Verify institution legitimacy, confirm student relationship |
| Medical Treatment | Hospital invoice, treatment letter, medical visa (if applicable) | Verify medical facility, confirm treatment necessity |
| Family Support | Relationship proof, declaration letter | Verify relationship, assess reasonableness of amount |

#### 16. Foreign Exchange Compliance

**Exchange Control Requirements:**
```
✓ Transaction complies with sender country FX regulations
✓ Transaction complies with recipient country FX regulations
✓ Required regulatory approvals obtained (import/export license, etc.)
✓ Exchange rate applied is within regulatory limits
✓ Repatriation rules followed (if applicable)
```

**Regulatory Reporting:**
- Export proceeds realization reporting
- Import payment advance reporting
- Foreign investment reporting
- Cross-border loan reporting

**Common FX Violations:**
- Over-invoicing or under-invoicing of trade transactions
- Round-tripping (funds leaving and returning to evade capital controls)
- Advance payments without proper authorization
- Non-repatriation of export proceeds

### Transaction Execution Checks (Additional to Domestic)

#### 17. SWIFT Message Compliance

**Mandatory Fields (MT103):**
- **:20:** Transaction Reference Number
- **:23B:** Bank Operation Code
- **:32A:** Value Date, Currency, Amount
- **:50K:** Ordering Customer (complete name and address)
- **:59:** Beneficiary Customer (complete name and address)
- **:70:** Remittance Information (payment purpose)
- **:71A:** Details of Charges (OUR/BEN/SHA)

**Data Quality Checks:**
```
✓ No special characters or formatting errors
✓ No abbreviations in name/address fields (use full legal names)
✓ Country codes are ISO 3166 compliant
✓ BIC codes are valid and registered
✓ Amount and currency are correct
✓ Purpose code matches actual purpose
✓ No vague descriptions (e.g., avoid "for invoice", use "Payment for 1000kg steel pipes per Invoice INV-2024-001")
```

**Structured vs. Unstructured Data:**
- Use structured address fields where possible (F50K, F59)
- Ensure all mandatory information is present
- Avoid ambiguous abbreviations

#### 18. Correspondent Bank Charges

**Charge Allocation (BEN/SHA/OUR):**
- **OUR:** All charges borne by sender (check sender agrees and can afford)
- **SHA:** Charges shared (sender pays sending bank, recipient pays receiving bank) - most common
- **BEN:** All charges borne by recipient (ensure recipient aware and agreeable)

**Compliance Check:**
```
✓ Charge instruction matches customer authorization
✓ Sufficient funds to cover charges
✓ Charge breakdown disclosed to customer
✓ No hidden fees
```

#### 19. Dual Approval for High-Risk Transactions

**Dual Approval Required:**
- Transaction to/from high-risk jurisdiction
- First-time transaction > USD 50,000
- Any PEP transaction
- Any transaction flagged by sanctions screening (resolved as false positive)
- Customer with previous suspicious activity history

**Approval Trail:**
- First approval: Branch Manager/Relationship Manager
- Second approval: Compliance Officer
- Both approvals must be documented with rationale

### Post-Transaction Monitoring (Additional to Domestic)

#### 20. Trade-Based Money Laundering (TBML) Monitoring

**TBML Red Flags:**

| Red Flag Category | Indicators |
|------------------|-----------|
| **Pricing Anomalies** | • Invoice prices significantly above/below market price<br>• Identical goods priced differently in short time period<br>• No logical explanation for price variance |
| **Commodity Type** | • Goods inconsistent with customer's business<br>• High-value, easily movable goods (gold, diamonds, electronics)<br>• Dual-use goods without appropriate licenses |
| **Shipping Anomalies** | • Circuitous shipping routes without logical reason<br>• Transshipment through high-risk jurisdictions<br>• Shipping to/from free trade zones |
| **Documentation Issues** | • Missing or incomplete trade documents<br>• Documents contain inconsistent information<br>• Use of shell companies as buyer/seller |
| **Transaction Pattern** | • Multiple small shipments instead of consolidated shipment<br>• Frequent amendments to letter of credit<br>• Unusual payment terms (large advance, deferred payment) |

**TBML Investigation Process:**
1. Flag transaction based on automated rule or manual review
2. Request additional documentation (full commercial invoice, packing list, bill of lading)
3. Verify pricing against market data (Bloomberg, local chambers of commerce, industry benchmarks)
4. Check customer's import/export history
5. Assess economic rationale for transaction
6. Escalate to Compliance Officer if suspicions persist
7. File SAR if money laundering suspected

#### 21. Ongoing Periodic Reviews

**High-Risk Customer Reviews (Quarterly):**
```
✓ Review all transactions in period
✓ Update customer risk rating
✓ Verify current KYC information
✓ Check for adverse media
✓ Assess need for EDD refresh
✓ Document review findings
```

**Correspondent Banking Relationship Review (Annual):**
```
✓ Review correspondent bank's AML program
✓ Assess transaction volumes and types
✓ Check for regulatory actions against correspondent
✓ Verify no involvement in money laundering cases
✓ Update due diligence file
```

### Red Flags for International Remittances

⚠️ **Immediate Escalation Required:**
1. Transaction involves comprehensively sanctioned jurisdiction (e.g., North Korea, Iran)
2. Customer mentions transaction is for weapons, drugs, or illegal activity
3. Transaction routed through multiple jurisdictions without clear business reason
4. Customer asks to split transaction to avoid reporting or screening
5. Payment involves shell company or entity with no legitimate business
6. Trade documents are forged or contain material misrepresentations
7. Law enforcement inquiry regarding customer or transaction
8. Transaction involves designated terrorist organization or individual
9. Customer refuses to provide trade documentation when required
10. SWIFT message contains sanctioned vessel, aircraft, or entity name

⚠️ **Enhanced Monitoring Required:**
1. Large transaction to/from high-risk jurisdiction
2. Customer changes destination country after initial instruction
3. Transaction involves complex ownership structures or nominees
4. Beneficiary located in jurisdiction with weak AML controls
5. Payment purpose vague or inconsistent with customer business
6. Customer requests expedited processing without clear reason
7. Wire transfer immediately followed by reversal request
8. Transaction involves free trade zone or offshore financial center
9. Customer provides minimal information and resists questions
10. Transaction involves goods subject to export controls without proper documentation

---

## Letter of Credit (LC) Compliance

### Scope
Letters of Credit are independent undertakings by issuing bank to pay beneficiary (seller/exporter) upon presentation of compliant documents, as per terms agreed in LC. LCs are governed by **UCP 600** (Uniform Customs and Practice for Documentary Credits).

**Key LC Parties:**
- **Applicant:** Buyer/Importer requesting LC issuance
- **Issuing Bank:** Bank issuing the LC (our bank)
- **Advising Bank:** Bank advising LC to beneficiary (correspondent bank)
- **Beneficiary:** Seller/Exporter receiving payment
- **Confirming Bank:** Bank adding its confirmation to LC (if applicable)
- **Negotiating Bank:** Bank negotiating documents under LC

### Pre-Issuance Compliance Checks

#### 22. Applicant Due Diligence

**Know Your Customer (KYC):**
```
✓ Applicant is existing customer with updated KYC
✓ Import business license valid (if required by jurisdiction)
✓ Credit assessment completed (credit limit, financial health)
✓ Previous LC utilization reviewed (any discrepancies, delays, defaults?)
✓ Customer risk rating assessed
✓ Sanctions screening completed (applicant + directors + UBOs)
```

**Financial Assessment:**
- Applicant's creditworthiness and financial capacity
- Existing exposure to bank (other LCs, loans, guarantees)
- Security/collateral for LC (cash margin, property mortgage, corporate guarantee)
- Debt service capacity (cash flow analysis)

**Import License and Regulatory Approvals:**
```
✓ Import license valid and covers LC amount
✓ FX approval obtained (if required)
✓ No prohibited imports per local regulations
✓ Import declaration filed (if required)
```

#### 23. Beneficiary Due Diligence

**Beneficiary Screening:**
```
✓ Sanctions screening against all lists (OFAC, UN, EU, local)
✓ Adverse media check (any negative news, lawsuits, fraud allegations)
✓ Business registry check (verify legal entity exists and is active)
✓ Export business verification (does beneficiary actually export claimed goods?)
✓ Reputation check with correspondent bank (if advising bank known to us)
```

**High-Risk Beneficiaries:**
- Located in high-risk jurisdiction
- Newly incorporated company with no track record
- Shell company indicators (nominee directors, registered office address only)
- Involved in high-risk commodities (gold, diamonds, arms, dual-use goods)
- Previous fraud or discrepancy issues

**Enhanced Due Diligence (EDD) for Beneficiaries:**
- Request certificate of incorporation and business license
- Request financial statements (if transaction amount significant)
- Conduct site visit or third-party verification (for very high-value LCs)
- Obtain references from other banks or trade associations

#### 24. Transaction Purpose and Trade Documentation

**Prohibited Transactions (Must Decline):**
- Military equipment/arms trade (without government approval and proper licensing)
- Sanctioned goods (as per OFAC, UN, EU lists)
- Dual-use goods to sanctioned countries or restricted end-users
- Goods covered by export control regulations without required licenses
- Illegal goods (drugs, counterfeit products, endangered species)

**High-Risk Commodities Requiring Enhanced Checks:**
- Precious metals (gold, silver, platinum)
- Precious stones (diamonds, emeralds, rubies)
- High-value electronics (semiconductors, servers, GPUs)
- Chemicals (especially precursor chemicals)
- Nuclear materials and related equipment
- Strategic minerals (cobalt, lithium, rare earth elements)

**Required Documentation:**

| Document Type | Purpose | Verification Steps |
|--------------|---------|-------------------|
| **Proforma Invoice** | Details of goods, pricing | Verify pricing is reasonable, no over/under-invoicing |
| **Purchase Order/Sales Contract** | Binding agreement between buyer and seller | Confirm terms match LC request, check authenticity |
| **Import License** | Government approval to import | Verify with issuing authority, check validity period |
| **Product Catalog/Specifications** | Technical details of goods | Confirm goods match applicant's business |
| **Insurance Certificate** (if CIF/CIP terms) | Cargo insurance coverage | Verify coverage amount matches LC value |

**Pricing Verification:**
- Compare invoice pricing against market benchmarks
- Check if pricing is consistent with previous transactions
- Flag significant deviations (>20% above/below market) for investigation
- Sources: Bloomberg, trade databases, industry associations, customs data

#### 25. LC Terms Review for Compliance Risks

**Red Flag Terms (Require Enhanced Review):**

| LC Term | Compliance Risk | Mitigation |
|---------|----------------|-----------|
| **Transferable LC** | Original beneficiary may transfer to unknown parties | Screen all transferees, obtain transfer approval |
| **Back-to-Back LC** | Middleman transaction, pricing opacity | Verify economic substance, check for TBML indicators |
| **High Value LC** (>USD 1M) | Money laundering, trade fraud | EDD on both parties, verify trade legitimacy |
| **Short Shipment Period** (<30 days from issuance) | Urgency may indicate unusual circumstances | Question applicant, verify business reason |
| **Vague Description of Goods** | May conceal true nature of goods | Reject LC, require detailed description |
| **Payment at Sight vs. Usance** | Usance creates credit risk, financing component | Credit assessment, check for disguised financing |
| **Transshipment Allowed** | Goods may be diverted to sanctioned jurisdictions | Require proof of final destination |
| **Partial Shipments Allowed** | Increases fraud risk, complicates TBML monitoring | Stricter document review for each shipment |

**Document List (Field 46A) Review:**
```
✓ Required documents are standard and reasonable
✓ No unusual documents requested (e.g., "beneficiary's certificate" for matters beyond beneficiary's control)
✓ Documents sufficient to evidence shipment and goods conformity
✓ No documents impossible to obtain or verify
```

**Clauses Requiring Legal Review:**
- Any clause deviating from UCP 600 standard practice
- Unusual liability disclaimers
- Conflict of laws provisions
- Arbitration clauses in non-standard jurisdictions

#### 26. Sanctions Screening for LCs

**Comprehensive Screening (BEFORE LC Issuance):**

```
PARTY SCREENING:
  ✓ Applicant (importer)
  ✓ Beneficiary (exporter)
  ✓ Advising bank
  ✓ Confirming bank (if any)
  ✓ Applicant's directors and UBOs
  ✓ Beneficiary's directors and owners (if available)
  ✓ Any party mentioned in additional conditions

GEOGRAPHIC SCREENING:
  ✓ Country of origin (where goods manufactured)
  ✓ Country of export (where goods shipped from)
  ✓ Country of import (destination)
  ✓ Any transshipment countries mentioned

COMMODITY SCREENING:
  ✓ Check if goods are sanctioned or controlled
  ✓ Verify no dual-use goods restrictions
  ✓ Check export control lists (US EAR, EU Dual-Use Regulation)
  ✓ Confirm no technology transfer restrictions
```

**Ongoing Screening:**
- Re-screen all parties upon any amendment to LC
- Re-screen if sanctions lists updated during LC validity period
- Screen transport documents when presented (vessel name, carrier)

#### 27. Approval Workflow for LC Issuance

| LC Amount (USD) | Credit Approval | Compliance Approval | Additional Requirements |
|----------------|----------------|--------------------|-----------------------|
| < 50,000 | Trade Finance Officer | Auto (if low risk) | Standard documentation |
| 50,000 - 250,000 | Trade Finance Manager | Compliance Officer | Purpose verification, pricing check |
| 250,001 - 1,000,000 | Head of Trade Finance | Senior Compliance Officer | EDD on beneficiary, market pricing verification |
| > 1,000,000 | Regional Credit Committee | Head of Compliance | Full investigation, site visit consideration |

**High-Risk LC (Regardless of Amount):**
- Compliance Officer approval mandatory
- Credit approval one level higher than normal
- Documentation of risk mitigation measures

**Compliance Sign-Off Includes:**
```
✓ All sanctions screening completed and cleared
✓ KYC/CDD up to date
✓ Trade documentation reviewed
✓ Pricing appears reasonable
✓ No TBML red flags identified
✓ Regulatory approvals confirmed
✓ Risk rating assigned
```

### Document Examination Compliance (Upon Presentation)

#### 28. First Presentation of Documents

**Compliance Checks at Document Examination Stage:**

```
DOCUMENT AUTHENTICITY:
  ✓ Documents appear genuine (no forgery indicators)
  ✓ Signatures and stamps authentic
  ✓ Security features verified (if applicable)
  ✓ Document dates are logical and consistent
  ✓ No material alterations or erasures

SANCTIONS RE-SCREENING:
  ✓ Screen all transport documents (bill of lading, airway bill, etc.)
  ✓ Screen vessel name and IMO number (for ocean shipments)
  ✓ Screen carrier name
  ✓ Screen any new parties mentioned in documents
  ✓ Verify goods shipped from/to permitted jurisdictions
```

**Bill of Lading (B/L) Specific Checks:**
- Verify vessel not on sanctioned vessel list (OFAC, UN, EU)
- Check vessel flag state (avoid sanctioned countries)
- Verify ports of loading and discharge are not sanctioned
- Check for "to order" consignee (requires endorsement)
- Verify "clean on board" notation (no clauses about damaged cargo)

**Commercial Invoice Checks:**
- Pricing consistent with proforma invoice and LC
- Goods description matches LC exactly
- Origin of goods stated and permissible
- Beneficiary details match LC

**Certificate of Origin Checks:**
- Issued by recognized chamber of commerce or authority
- Origin country not sanctioned
- Goods eligible for preferential tariff treatment (if claimed)

#### 29. Discrepancy Handling

**Strict Compliance Rule (UCP 600 Article 14):**
- Documents must conform **exactly** to LC terms
- Bank must determine compliance based on documents alone
- Any deviation = discrepancy

**Common Discrepancies:**
1. Late presentation (after expiry date or latest shipment date)
2. Description of goods does not match LC
3. Document missing or not presented
4. Signature missing on required document
5. Insurance coverage insufficient
6. B/L not "clean on board"
7. Transshipment prohibited but B/L shows transshipment

**Discrepancy Processing Workflow:**
```
STEP 1: Identify discrepancy within 5 banking days (UCP 600 Article 14)
STEP 2: Contact applicant immediately
STEP 3: Options:
  A. Applicant waives discrepancy → Payment approved
  B. Applicant rejects discrepancy → Payment refused, documents returned
  C. Applicant silent → Documents held for further instruction (do NOT pay)

STEP 4: Issue discrepancy notice to presenter (if payment refused)
STEP 5: Document outcome in system
```

**Compliance During Discrepancy:**
```
✓ Do NOT pay against discrepant documents without applicant's explicit waiver
✓ Do NOT hold documents beyond reasonable time
✓ Notify presenting bank of refusal and reasons
✓ Return documents as per presenter's instructions
✓ No liability accepted if documents refused for valid discrepancies
```

**Warning:** Even if applicant waives discrepancy, Compliance must still verify no sanctions or fraud issues before payment.

#### 30. Payment Authorization

**Final Compliance Checks Before Payment:**
```
✓ All documents in order (or discrepancies waived)
✓ Sanctions screening cleared
✓ No fraud alerts regarding documents or transaction
✓ Beneficiary bank details verified (no changes from original LC)
✓ Amount matches documents
✓ Payment instruction matches LC (negotiation, acceptance, payment at sight)
✓ Applicant's account has sufficient funds (or credit limit approved)
```

**Payment Methods:**
- **Payment at Sight:** Immediate payment upon presentation of compliant documents
- **Deferred Payment:** Payment at maturity date (usance LC)
- **Acceptance:** Bank accepts time draft, pays at maturity
- **Negotiation:** Advising/negotiating bank negotiates documents, issuing bank reimburses

**Reimbursement to Correspondent Bank:**
- Verify reimbursement authorization matches LC
- Use correct correspondent banking instructions
- Screen reimbursement payment before execution
- Debit applicant's account (or utilize credit line)

### Post-Payment Compliance

#### 31. Regulatory Reporting for LCs

**Import Reporting (Importer Country):**
- Report LC issuance to central bank/regulator (if required)
- Report import payment execution
- Report FX conversion (if LC currency differs from local currency)

**Export Reporting (Exporter Country via Correspondent):**
- Not applicable if we are issuing bank
- If we are advising/negotiating bank, may need to report export proceeds

**Transaction Reporting:**
- Large transaction reporting (if LC amount exceeds threshold)
- Any suspicious activity related to LC (SAR filing)

#### 32. LC Utilization Monitoring

**Track Key Metrics:**
- LC utilization rate (% of issued LCs resulting in payment)
- Average time to presentation
- Discrepancy rate per applicant
- Default rate (applicant unable to reimburse bank)

**Red Flags in LC Utilization:**
- LC issued but never utilized (possible fraud, phantom trade)
- Immediate presentation of documents after LC issuance (collusion between applicant and beneficiary)
- Repeated discrepancies with same beneficiary (document fabrication)
- LC amended multiple times (shifting terms to facilitate fraud)
- Applicant defaults on reimbursement (credit risk)

#### 33. Audit and Record Keeping

**Retention Requirements:**
- LC application and approval documents: 7 years
- All issued LCs and amendments: 7 years
- Transport and commercial documents: 7 years
- Correspondence with parties: 7 years
- Sanctions screening results: 7 years
- Payment records and reimbursement details: 7 years

**Audit Trail:**
```
✓ All decisions documented (issuance, discrepancy handling, payment)
✓ Approvals recorded with timestamps and user IDs
✓ Sanctions screening evidence retained
✓ Communication logs maintained (SWIFT messages, emails, phone calls)
✓ Any investigation reports or SAR filings
```

### Red Flags for Letters of Credit

⚠️ **Immediate Escalation Required:**
1. Applicant or beneficiary matches sanctions list
2. Goods are military equipment without proper export/import licenses
3. Documents presented appear forged or fraudulent
4. Vessel used for shipment is on sanctioned vessel list
5. Beneficiary requests payment to different bank account than originally specified
6. LC terms include unusual clauses designed to circumvent compliance controls
7. Law enforcement inquiry regarding LC or parties
8. Goods shipped to sanctioned country or transshipped through prohibited jurisdiction
9. Applicant admits purpose is to evade capital controls or sanctions
10. Documents contain material inconsistencies (pricing, quantity, description) indicating fraud

⚠️ **Enhanced Monitoring Required:**
1. Back-to-back LC or transferable LC with unknown ultimate parties
2. High-value LC (>USD 1M) with newly established beneficiary
3. Beneficiary located in high-risk or offshore jurisdiction
4. Goods description vague or overly generic
5. Pricing significantly above or below market (TBML indicator)
6. Applicant's business does not match imported goods (e.g., restaurant importing machinery)
7. Frequent amendments to LC terms (extension of expiry, change of beneficiary)
8. Short validity period with urgent shipment requirement
9. No commercial substance (applicant and beneficiary related parties)
10. Multiple LCs issued for same trade transaction (splitting to avoid reporting)

---

## Letter of Guarantee (LG) Compliance

### Scope
Letters of Guarantee (also called Bank Guarantees) are independent undertakings by issuing bank to pay beneficiary if applicant fails to fulfill contractual obligations. LGs are governed by **URDG 758** (Uniform Rules for Demand Guarantees) or **ISP98** (International Standby Practices).

**Types of LGs:**
- **Performance Guarantee:** Ensures contract performance (construction, service delivery)
- **Advance Payment Guarantee:** Protects advance payment to contractor
- **Bid Bond/Tender Guarantee:** Ensures bidder will accept contract if awarded
- **Warranty/Retention Guarantee:** Covers defects during warranty period
- **Financial Guarantee:** Ensures payment of financial obligations (loan repayment, lease payments)
- **Customs Guarantee:** Allows release of goods before duty payment
- **Shipping Guarantee:** Allows release of goods without original B/L

**Key LG Parties:**
- **Applicant/Principal:** Party requesting guarantee issuance (contractor, borrower, tenant)
- **Issuing Bank/Guarantor:** Bank issuing the LG (our bank)
- **Beneficiary/Obligee:** Party in whose favor guarantee issued (employer, lender, landlord)
- **Counter-Guarantor Bank:** Bank providing counter-guarantee (if any)

### Pre-Issuance Compliance Checks

#### 34. Applicant Due Diligence (Similar to LC but Enhanced)

**KYC and Credit Assessment:**
```
✓ Applicant is existing customer with updated KYC
✓ Financial capacity assessed (can applicant fulfill underlying obligation?)
✓ Previous LG utilization reviewed (any claims, defaults, litigation?)
✓ Sanctions screening completed (applicant + directors + UBOs)
✓ Customer risk rating assessed
✓ Credit limit available (LG counts as contingent liability)
✓ Security/collateral obtained (cash margin, property, corporate guarantee)
```

**Industry and Regulatory Checks:**
- Applicant holds necessary licenses for underlying contract (construction license, business permit, etc.)
- Compliance with sector-specific regulations (environmental, safety, labor laws)
- Track record verification (for performance guarantees - can applicant perform?)

**Financial Covenants (for High-Value LGs):**
- Minimum net worth requirement
- Debt-to-equity ratio limits
- Prohibition on additional debt without bank consent
- Requirement for periodic financial reporting

#### 35. Beneficiary Due Diligence

**Beneficiary Screening (More Rigorous than LC):**
```
✓ Sanctions screening against all lists
✓ Adverse media check (lawsuits, fraud allegations, insolvency)
✓ Business registry verification (legal entity exists and active)
✓ Reputation check (history of unfair LG claims?)
✓ Relationship to applicant (are they related parties? Any conflict of interest?)
✓ Geographic risk (is beneficiary in high-risk jurisdiction?)
```

**High-Risk Beneficiaries:**
- Government entities in countries with weak rule of law (risk of unfair calling)
- Newly established companies with no track record
- Offshore entities with opaque ownership
- Beneficiaries with history of disputed LG claims
- Beneficiaries located in jurisdictions with pro-beneficiary legal systems

**Unfair Calling Risk Assessment:**
- Is beneficiary known for aggressive or unfair LG claims?
- Is jurisdiction known for pro-beneficiary courts (risk of injunction not working)?
- Does underlying contract have clear performance milestones (or vague terms enabling disputes)?
- Is there arbitration clause in underlying contract (or litigation in beneficiary's home court)?

#### 36. Underlying Transaction Review

**Fundamental Requirement:** LG must be based on a legitimate underlying transaction (contract, loan agreement, lease, etc.)

**Underlying Contract Review:**
```
✓ Obtain copy of underlying contract (mandatory for LGs > USD 100,000)
✓ Verify contract is signed by both parties
✓ Confirm contract terms are clear and enforceable
✓ Check contract value matches LG amount (LG typically 5-20% of contract value)
✓ Verify contract legality (is the contract for prohibited goods/services?)
✓ Assess commercial reasonableness (does contract make business sense?)
```

**Red Flag Contracts:**
- Contract for illegal goods or services
- Contract with sanctioned party
- Contract value grossly inflated (TBML indicator)
- Vague or ambiguous contract terms (risk of disputes)
- No clear deliverables or milestones
- Related party transactions with no commercial substance
- Contract in jurisdiction with weak rule of law

**Contract Types Requiring Enhanced Review:**
| Contract Type | Compliance Risk | Enhanced Checks Required |
|--------------|----------------|-------------------------|
| **Construction (Foreign)** | Bribery, corruption, unfair calling | Verify permits, check for state-owned beneficiary (FCPA risk) |
| **Oil & Gas, Mining** | Sanctions, corruption, environmental | Verify compliance with sanctions, environmental laws |
| **Government Procurement** | Corruption, political risk | FCPA/UK Bribery Act compliance, PEP checks |
| **Financial Guarantees (Non-Trade)** | Money laundering, evasion | Verify legitimacy of underlying debt, check for layering |
| **Real Estate (Foreign)** | Money laundering, sanctions evasion | Verify property ownership, source of funds |
| **Joint Venture / Partnership** | Hidden ownership, conflicts | UBO verification, check for sanctioned parties |

#### 37. LG Terms Review for Compliance

**Essential LG Terms:**
- **Amount:** Clear, unambiguous amount in specific currency
- **Expiry Date:** Defined expiry date (or latest date for claim submission)
- **Claim Procedure:** What documents beneficiary must present to make claim
- **Governing Law and Jurisdiction:** Where disputes will be resolved
- **Reduction Clause:** Amount reduces as contract progresses (if applicable)
- **Extension Clause:** Automatic extension vs. bank consent required

**Prohibited LG Terms (Must Decline):**
- **Evergreen Clause:** LG automatically extends indefinitely (unacceptable risk)
- **Unconditional Payment on First Demand with No Documentation:** Too risky (require at least a signed statement of default)
- **Payment Without Right to Verify:** Bank must retain right to verify claim documents
- **No Expiry Date:** Creates indefinite liability (must have expiry date)
- **Transferable/Assignable Without Bank Consent:** Risk of unknown beneficiary

**Demand vs. Suretyship Guarantees:**
- **Demand Guarantee (Preferred):** Bank pays upon beneficiary's demand, subject only to presentation of specified documents. Bank does NOT investigate underlying contract dispute. (URDG 758 standard)
- **Suretyship/Accessory Guarantee (Avoid):** Bank's liability tied to applicant's liability under underlying contract. Bank may need to investigate contract performance. Creates complex legal risks. (Decline unless exceptional circumstances and legal approval)

**Claim Documentation Requirements (Typical):**
```
MINIMUM CLAIM DOCUMENTS:
  ✓ Beneficiary's signed statement of claim
  ✓ Statement that applicant has defaulted on underlying obligation
  ✓ Copy of original LG (or certified copy)

ADDITIONAL DOCUMENTS (if specified in LG):
  ✓ Independent engineer's certificate (for performance LG)
  ✓ Arbitration award or court judgment (for dispute-based claims)
  ✓ Proof of contract termination
  ✓ Evidence of contractor abandonment
```

**Warning:** Too many documentary requirements make LG difficult to claim (may not serve its purpose). Balance between protecting bank and ensuring LG is effective.

#### 38. Sanctions Screening for LGs

**Comprehensive Screening (BEFORE LG Issuance):**
```
PARTY SCREENING:
  ✓ Applicant (contractor, borrower, tenant)
  ✓ Beneficiary (employer, lender, landlord)
  ✓ Applicant's directors and UBOs
  ✓ Beneficiary's directors and UBOs (if available)
  ✓ Any sub-contractors mentioned in underlying contract
  ✓ Project owner (if different from beneficiary)
  ✓ Counter-guarantor bank (if any)

GEOGRAPHIC SCREENING:
  ✓ Country where underlying contract will be performed
  ✓ Beneficiary's country of incorporation and principal place of business
  ✓ Any countries involved in project execution

PROJECT/CONTRACT SCREENING:
  ✓ Is project in sanctioned country or region?
  ✓ Does project involve sanctioned entities (state-owned enterprises)?
  ✓ Is project subject to sectoral sanctions (e.g., Russian energy sector)?
```

**Ongoing Screening:**
- Re-screen all parties upon any amendment to LG
- Re-screen if sanctions lists updated during LG validity period
- Re-screen at claim stage (before payment to beneficiary)

**Sectoral Sanctions (Special Attention):**
- **Russia Sectoral Sanctions:** Energy, financial, defense sectors
- **Venezuela Sectoral Sanctions:** Oil sector, government entities
- **Iran Sectoral Sanctions:** Oil, petrochemical, shipping, financial

If LG supports contract in sanctioned sector, decline even if parties themselves not on SDN list.

#### 39. Corruption and Bribery Risk Assessment (FCPA/UKBA)

**Foreign Corrupt Practices Act (FCPA) - US**
**UK Bribery Act (UKBA) - UK**

Both laws prohibit bribing foreign government officials to obtain or retain business. Banks can face liability if they facilitate bribery (e.g., by issuing LG for project involving kickbacks).

**High-Risk Scenarios (Enhanced Due Diligence):**

| Risk Factor | Indicators | Mitigation |
|------------|-----------|-----------|
| **Government Counterparty** | Beneficiary is state-owned enterprise or government ministry | Verify transparent procurement process, obtain legal opinion |
| **High-Risk Country** | Contract in country with high corruption perception index score | EDD on applicant, verify compliance program, obtain certifications |
| **Agent/Intermediary Involvement** | Contract involves third-party agent or broker with vague role | Verify agent's legitimacy, reasonableness of fees, obtain contract |
| **Unusual Payment Terms** | Contract includes large upfront payments or unclear milestones | Question business rationale, verify market norms |
| **Related Parties** | Applicant and beneficiary have hidden relationships | UBO verification, check for conflicts of interest |

**Required Certifications (for High-Risk LGs):**
```
✓ Applicant certifies no bribes paid or promised
✓ Applicant has anti-bribery compliance program (if corporate)
✓ Applicant will comply with FCPA/UKBA
✓ Applicant will notify bank if any violations occur
```

**Legal Review:** For LGs supporting government contracts in high-risk countries, obtain legal department sign-off.

#### 40. Approval Workflow for LG Issuance

| LG Amount (USD) | Credit Approval | Compliance Approval | Legal Approval |
|----------------|----------------|--------------------|--------------------|
| < 100,000 | Relationship Manager | Auto (if low risk) | Not required |
| 100,000 - 500,000 | Credit Manager | Compliance Officer | Not required |
| 500,001 - 2,000,000 | Head of Credit | Senior Compliance Officer | Required if high-risk country |
| > 2,000,000 | Regional Credit Committee | Head of Compliance | Required |

**High-Risk LG (Regardless of Amount):**
- Compliance Officer approval mandatory
- Legal department review mandatory
- Credit approval one level higher than normal
- Risk mitigation documented

**Compliance Sign-Off Checklist:**
```
✓ All sanctions screening completed and cleared
✓ KYC/CDD up to date for applicant and beneficiary
✓ Underlying contract reviewed and appears legitimate
✓ No FCPA/UKBA red flags
✓ LG terms reviewed and acceptable
✓ Regulatory approvals obtained (if required)
✓ Risk rating assigned
✓ Collateral/security documented
```

### Claim Processing Compliance

#### 41. Claim Presentation and Examination

**Upon Receipt of Claim:**
```
STEP 1: Log claim in system with receipt date/time
STEP 2: Notify applicant immediately (within 24 hours)
STEP 3: Verify claim is within LG validity period
STEP 4: Examine documents presented against LG requirements
STEP 5: Determine if claim is compliant
```

**Documentary Compliance Check:**
```
✓ All required documents presented
✓ Documents dated within LG validity period
✓ Beneficiary's signature matches specimen (if on file)
✓ Statement of claim is clear and unambiguous
✓ Claim amount does not exceed LG amount
✓ Documents in required language (or translated)
```

**Sanctions Re-Screening at Claim Stage:**
```
✓ Re-screen beneficiary (sanctions lists may have updated)
✓ Screen beneficiary's bank account (payment destination)
✓ Screen any new parties mentioned in claim documents
✓ Verify beneficiary country not under comprehensive sanctions
✓ Check for any regulatory restrictions on payments
```

**Warning:** Even if claim documents comply with LG, bank must NOT pay if beneficiary is sanctioned or payment would violate law.

#### 42. Applicant's Right to Object vs. Bank's Independent Obligation

**Key Principle (URDG 758):** LG is independent of underlying contract. Bank must pay compliant claim regardless of applicant's objections to underlying contract dispute.

**Applicant's Options When Claim Received:**
1. **Pay Bank (Reimburse):** Applicant pays bank, bank pays beneficiary
2. **Object but Accept Payment:** Applicant objects but acknowledges bank must pay (bank pays, debits applicant's account)
3. **Seek Court Injunction:** Applicant goes to court to stop payment (on grounds of fraud, for example)

**Bank's Position:**
- Bank examines documents only, not underlying contract performance
- If documents comply with LG, bank must pay (unless court injunction obtained)
- Applicant's objections to contract performance do NOT relieve bank of payment obligation

**Fraud Exception (Rare):**
Bank may refuse to pay if:
- **Documentary Fraud:** Claim documents are forged or fraudulent
- **Beneficiary Fraud:** Beneficiary is making claim in bad faith with knowledge of no default (requires strong evidence)

**Fraud Indicators:**
- Documents clearly forged (signatures don't match, dates impossible, etc.)
- Beneficiary admits in writing that claim is false
- Applicant provides clear evidence of performance (and beneficiary cannot refute)
- Court judgment declares claim fraudulent

**Fraud Handling Procedure:**
1. Immediately escalate to Legal and Compliance
2. Obtain external legal opinion (do not rely solely on internal judgment)
3. Document all evidence of fraud
4. Notify beneficiary that payment is suspended pending investigation
5. Only refuse payment if fraud is clear and well-documented (risk of liability if wrong)

#### 43. Court Injunction Handling

**If Applicant Obtains Court Injunction:**
```
✓ Verify injunction is from court with proper jurisdiction
✓ Verify injunction specifically covers this LG
✓ Obtain legal department confirmation that injunction is valid and enforceable
✓ Notify beneficiary of injunction and payment suspension
✓ Hold payment pending court resolution
✓ Monitor court case status
```

**Conflicting Injunctions (Rare but Possible):**
- Court in applicant's country issues injunction prohibiting payment
- Court in beneficiary's country orders bank to pay

**Resolution:**
- Obtain legal advice immediately
- Consider interpleading (depositing funds with court and letting court decide)
- Assess which jurisdiction has stronger claim to govern LG
- Document rationale for decision

#### 44. Payment Authorization

**Final Compliance Checks Before Payment:**
```
✓ Claim documents comply with LG (or discrepancies waived by applicant)
✓ Sanctions screening cleared
✓ No fraud indicators
✓ No valid court injunction in effect
✓ Beneficiary bank details verified
✓ Payment amount correct
✓ Applicant has reimbursed bank (or credit line available)
```

**Payment Timeline (URDG 758):**
- Bank has **5 banking days** from receipt of claim to decide
- Payment must be made promptly after decision to pay

**Payment Methods:**
- Wire transfer to beneficiary's bank account (as specified in LG)
- Check/draft (if acceptable to beneficiary and compliant with LG)

**Record Keeping:**
```
✓ Claim documents retained (7 years)
✓ Communication with applicant documented
✓ Sanctions screening results
✓ Payment authorization and evidence
✓ Any legal opinions obtained
```

### Post-Claim Compliance

#### 45. Subrogation and Recovery

**After paying beneficiary, bank has right to recover from applicant:**
- Debit applicant's account (if sufficient funds and account pledge agreement in place)
- Enforce collateral (cash margin, property mortgage, guarantees)
- Pursue legal action against applicant (if no collateral or insufficient)

**Subrogation:**
- Bank "steps into shoes" of beneficiary
- Bank can pursue applicant's rights under underlying contract
- May recover some or all of payment from applicant through contract remedies

**Compliance During Recovery:**
```
✓ Ensure recovery actions comply with local laws (no harassment, threats, illegal practices)
✓ Obtain legal advice before enforcement actions
✓ Document all communications with applicant
✓ Consider settlement negotiations
```

#### 46. Regulatory Reporting for LGs

**LG Issuance Reporting (if required by jurisdiction):**
- Report LG issuance to central bank (creates contingent liability on bank's books)
- Report guarantees in favor of foreign beneficiaries (cross-border exposure)

**Claim Payment Reporting:**
- Large transaction reporting (if claim payment exceeds threshold)
- Outward remittance reporting (if payment to foreign beneficiary)
- FX transaction reporting (if currency conversion involved)

**Suspicious Activity Reporting (SAR):**
- File SAR if claim appears fraudulent
- File SAR if underlying transaction is suspicious
- File SAR if applicant attempts to use LG to evade capital controls

#### 47. LG Portfolio Monitoring

**Key Risk Indicators:**
- **Claim Rate:** % of LGs resulting in claims (high rate indicates poor credit assessment or fraud)
- **Recovery Rate:** % of claims recovered from applicants (low rate indicates weak collateral)
- **Concentration Risk:** Exposure to single applicant, beneficiary, industry, or geography
- **Expiry Management:** LGs approaching expiry (ensure timely release or renewal)

**Monthly Reporting:**
- Total LG outstanding by applicant, beneficiary, country, industry
- Claims received, paid, pending, rejected
- Overdue reimbursements from applicants
- Collateral coverage ratio

**Red Flags in LG Portfolio:**
- Multiple claims from same beneficiary (unfair calling risk)
- Claims in specific geographic area (political instability, weak rule of law)
- Applicants defaulting on LG reimbursement (credit risk)
- High rate of LG amendments (contract instability)
- LGs never claimed and expiring unused (were they sham transactions?)

### Red Flags for Letters of Guarantee

⚠️ **Immediate Escalation Required:**
1. Applicant or beneficiary matches sanctions list
2. Underlying contract is for illegal goods or services
3. Claim documents are clearly forged or fraudulent
4. LG supports contract in comprehensively sanctioned country
5. Evidence of bribery or corruption in underlying contract
6. Court injunction received prohibiting payment
7. Law enforcement inquiry regarding LG or underlying transaction
8. Applicant admits underlying contract is a sham
9. LG terms include "evergreen" clause (indefinite liability)
10. Beneficiary is known entity involved in prior fraudulent claims

⚠️ **Enhanced Monitoring Required:**
1. LG supports government contract in high-corruption country (FCPA risk)
2. Underlying contract value grossly inflated (TBML indicator)
3. Related-party transaction with no clear commercial purpose
4. Beneficiary located in high-risk or offshore jurisdiction
5. Frequent amendments to LG (extensions, amount increases)
6. No underlying contract provided despite high LG amount
7. Applicant has weak financials and inadequate collateral
8. LG terms heavily favor beneficiary (unfair calling risk)
9. First-time applicant requesting high-value LG
10. Unusual urgency in LG issuance without clear business reason

---

## Common Compliance Controls

The following controls apply across **Remittances, LCs, and LGs:**

### 48. Customer Risk Rating

**Risk Rating Matrix:**

| Factor | Low Risk (1-2) | Medium Risk (3-4) | High Risk (5) |
|--------|---------------|------------------|--------------|
| **Customer Type** | Established corporate, regulated entity | SME, private company | New customer, cash-intensive business, PEP |
| **Geography** | Low-risk countries (FATF compliant) | Medium-risk countries | High-risk/sanctioned countries |
| **Transaction Volume** | Consistent, predictable | Moderate fluctuations | Sudden spikes, unusual patterns |
| **Product Complexity** | Simple wire transfers | Standard LCs | Complex LCs/LGs, back-to-back |
| **Sector** | Low-risk (professional services, manufacturing) | Medium-risk (retail, import-export) | High-risk (casinos, MSBs, arms dealers, gold) |
| **Relationship Duration** | >3 years with no issues | 1-3 years | <1 year or new relationship |

**Risk Score Calculation:**
- Total score = sum of factor scores (6-30 possible range)
- **Low Risk:** 6-12 (standard CDD, annual review)
- **Medium Risk:** 13-20 (enhanced CDD, semi-annual review)
- **High Risk:** 21-30 (EDD, quarterly review, senior approval for transactions)

**Risk Rating Uses:**
- Determines CDD level
- Sets transaction approval requirements
- Defines monitoring frequency
- Influences sanctions screening sensitivity (high-risk = manual review of all matches)

### 49. Periodic Customer Review

**Review Frequency:**
- **Low Risk:** Annual
- **Medium Risk:** Semi-annual
- **High Risk:** Quarterly

**Review Checklist:**
```
✓ Update KYC information (address, directors, UBOs, business activities)
✓ Re-screen customer and UBOs against sanctions lists
✓ Conduct adverse media search
✓ Review transaction activity for past period (any unusual patterns?)
✓ Update financial information (financial statements, credit reports)
✓ Re-assess risk rating (escalate or de-escalate as appropriate)
✓ Verify regulatory licenses/approvals still valid
✓ Document review findings and approval
```

**Triggers for Ad-Hoc Review (Before Scheduled):**
- Significant change in transaction pattern
- Negative media coverage
- Regulatory inquiry
- Sanctions list update affecting customer
- Customer requests significant increase in limits
- Adverse information from correspondent bank

### 50. Staff Training and Awareness

**Mandatory Training (All Staff Handling Remittances, LCs, LGs):**
- **AML/CFT Fundamentals:** Annual (2-3 hours)
- **Sanctions Compliance:** Annual (1-2 hours)
- **Trade-Based Money Laundering:** Annual for trade finance staff (2 hours)
- **Fraud Detection:** Annual (1 hour)
- **FCPA/UKBA (Anti-Bribery):** Annual for LG staff (1 hour)
- **System Training:** As needed for new systems

**Training Effectiveness Measurement:**
- Post-training quiz (minimum 80% passing score)
- Periodic scenario-based testing
- Mystery shopper exercises (compliance testing)

**Red Flag Awareness:**
- All staff must be trained to recognize and escalate red flags
- Clear escalation procedures documented and practiced
- No tolerance for ignoring red flags or "looking the other way"

### 51. Independent Audit and Testing

**Internal Audit (Annual):**
- Sample testing of transaction approvals
- Sanctions screening effectiveness review
- Documentation completeness audit
- Compliance with policies and procedures
- Staff training records verification

**External Audit (Annual):**
- Financial statement audit includes AML/CFT controls assessment
- Independent testing of compliance framework

**Regulatory Examination (Periodic):**
- Prepare for regulatory examinations
- Provide requested documentation promptly
- Address findings and implement corrective actions

**Sample Size for Testing:**
- Low-risk transactions: Minimum 2% sample
- High-risk transactions: Minimum 10% sample

### 52. Technology and Automation

**Automated Compliance Tools:**
- **Sanctions Screening Engine:** Real-time screening with name-matching algorithms
- **Transaction Monitoring System:** Rule-based alerts for suspicious activity
- **KYC/CDD Platform:** Centralized customer information and due diligence
- **Trade Finance System:** LC/LG issuance, amendment, document management
- **Regulatory Reporting System:** Automated CTR, SAR, LTR generation
- **Audit Trail System:** Immutable logs of all compliance actions

**System Maintenance:**
- Daily sanctions list updates (or as published)
- Monthly rule tuning (reduce false positives without reducing effectiveness)
- Annual system validation (ensure accuracy, no bugs)

**System Limitations:**
- No system is 100% accurate (require manual review for high-risk cases)
- False positives are inevitable (but should be minimized)
- Staff must be trained NOT to blindly accept system outputs

---

## Escalation and Reporting

### 53. Internal Escalation Procedures

**Level 1: Immediate Escalation to Line Manager**
- Sanctions match (exact or high confidence)
- Customer refuses to provide required information
- Suspected document forgery
- Transaction appears to involve illegal activity

**Level 2: Escalation to Compliance Officer**
- Line Manager determines transaction requires senior review
- High-risk transaction requiring approval
- Unusual transaction pattern identified
- Court injunction or regulatory inquiry received

**Level 3: Escalation to Senior Management**
- Potential SAR filing
- Significant compliance breach
- Regulatory enforcement action
- High-profile customer or transaction with reputational risk

**Level 4: Escalation to Board/Executive Committee**
- Material AML/CFT failure
- Regulatory penalty or enforcement action
- Significant financial loss due to fraud or compliance failure

### 54. Suspicious Activity Reporting (SAR)

**When to File SAR:**
- Transaction involves known or suspected money laundering
- Transaction involves known or suspected terrorist financing
- Transaction has no apparent lawful purpose
- Transaction involves fraud or misrepresentation
- Customer behavior is suspicious or evasive
- Transaction structure appears designed to evade reporting or regulations

**SAR Process:**
```
STEP 1: Detect suspicious activity (automated alert or manual identification)
STEP 2: Investigate and document findings
STEP 3: Compliance Officer reviews and determines if SAR warranted
STEP 4: Draft SAR with detailed narrative
STEP 5: Senior management review and approval
STEP 6: File SAR with Financial Intelligence Unit (FIU) within required timeframe
STEP 7: Maintain confidentiality (do NOT inform customer)
STEP 8: Continue to monitor customer activity
STEP 9: Consider account closure if risk too high
```

**SAR Filing Deadline:**
- **United States:** 30 days from detection
- **United Kingdom:** As soon as practicable (typically within hours to days for terrorism)
- **European Union:** Varies by country (typically immediate for terrorism, otherwise within days)

**SAR Confidentiality:**
- **NEVER inform customer that SAR has been filed** (this is a criminal offense in most jurisdictions)
- Limit internal knowledge of SAR to need-to-know basis
- Do not reference SAR in any communication with customer
- If customer's transaction is delayed or declined, provide generic reason (e.g., "additional compliance review required")

### 55. Regulatory Reporting

**Transaction Reports:**
| Report Type | Trigger | Deadline | Submitted To |
|------------|---------|----------|--------------|
| **Cash Transaction Report (CTR)** | Cash or equivalent > USD 10,000 | 15 days | Financial Crimes Enforcement Network (FinCEN) or local FIU |
| **Suspicious Activity Report (SAR)** | Suspicious transaction | 30 days (US) | FinCEN or local FIU |
| **Large Transaction Report (LTR)** | Transaction > USD 100,000 (varies by jurisdiction) | Monthly or quarterly | Central bank or financial regulator |
| **Cross-Border Wire Transfer Report** | International wire > threshold | Varies | Central bank or customs authority |
| **LC Issuance Report** | Per local requirements | Varies | Central bank or trade regulator |
| **LG Issuance Report** | Per local requirements | Varies | Central bank |

**Export Control Reports (if applicable):**
- Export of dual-use goods or controlled technology
- Report to export control authority (e.g., Bureau of Industry and Security - BIS in US)

### 56. Correspondent Bank Reporting

**Obligation to Report to Correspondent Banks:**
- If we detect suspicious activity on transaction involving correspondent bank, we may be obligated to inform them
- This is particularly important for US correspondent banks (OFAC compliance risk for them)

**When to Notify Correspondent:**
- Sanctions match discovered after wire sent (to allow correspondent to stop payment)
- Fraudulent transaction discovered involving correspondent's system
- Customer defaults on LC reimbursement (may affect correspondent's credit exposure)

---

## Appendices

### Appendix A: KYC Documentation Matrix

| Customer Type | Mandatory Documents | Additional Documents (Risk-Based) |
|--------------|--------------------|---------------------------------|
| **Individual (Domestic)** | • Government-issued photo ID (passport, national ID, driver's license)<br>• Proof of address (utility bill, bank statement <3 months old)<br>• Tax identification number | • Employment verification<br>• Source of wealth documentation<br>• Biometric data |
| **Individual (Foreign)** | • Passport<br>• Proof of address in home country<br>• Tax ID or equivalent<br>• Visa/residence permit (if applicable) | • Reference letter from foreign bank<br>• Source of funds declaration<br>• Employment/business documentation |
| **Sole Proprietorship** | • Owner's ID and proof of address<br>• Business registration certificate<br>• Business license<br>• Tax registration | • Business bank statements<br>• Financial statements<br>• Major customer/supplier list |
| **Private Company** | • Certificate of incorporation<br>• Articles of association<br>• Board resolution to open account<br>• Directors' ID and proof of address<br>• Shareholder register<br>• UBO declaration (≥25% ownership) | • Audited financial statements (2 years)<br>• Business plan<br>• Group structure chart<br>• Licenses/permits<br>• Major contracts |
| **Public Company (Listed)** | • Certificate of incorporation<br>• Board resolution<br>• Authorized signatory list<br>• Annual report<br>• Stock exchange listing proof | • Corporate governance policies<br>• Compliance certifications |
| **Government Entity** | • Official gazette or government document establishing entity<br>• Authorized signatory list<br>• Government authorization for banking relationship | • Budget document<br>• Legislation creating entity |
| **Non-Profit Organization (NGO/Charity)** | • Certificate of incorporation<br>• Charitable registration<br>• List of board members/trustees<br>• Source of funds (donors, grants)<br>• Beneficiary information (who benefits from organization's work) | • Annual report<br>• List of major donors<br>• Field visit report<br>• Certification from NGO oversight body |
| **Trust** | • Trust deed<br>• Trustee ID and proof of address<br>• Settlor information<br>• Beneficiary information | • Source of trust assets<br>• Legal opinion on trust structure |

### Appendix B: Sanctions Lists and Resources

**Primary Sanctions Lists:**

| Jurisdiction | List Name | URL |
|-------------|-----------|-----|
| **United States** | OFAC Specially Designated Nationals (SDN) List | https://sanctionssearch.ofac.treas.gov/ |
| **United States** | OFAC Consolidated Sanctions List | https://www.treasury.gov/ofac/downloads/sanctions/ |
| **United Nations** | UN Security Council Consolidated List | https://www.un.org/securitycouncil/content/un-sc-consolidated-list |
| **European Union** | EU Consolidated Sanctions List | https://data.europa.eu/data/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions |
| **United Kingdom** | UK Sanctions List | https://www.gov.uk/government/publications/financial-sanctions-consolidated-list-of-targets |

**Additional Screening Sources:**
- **World Bank Debarred Parties:** https://www.worldbank.org/en/projects-operations/procurement/debarred-firms
- **Interpol Wanted Persons:** https://www.interpol.int/en/How-we-work/Notices/View-Red-Notices
- **FBI Most Wanted:** https://www.fbi.gov/wanted
- **Adverse Media Databases:** World-Check (Refinitiv), LexisNexis, Dow Jones

**Country Risk Resources:**
- **FATF Public Statements:** https://www.fatf-gafi.org/countries/#high-risk
- **Basel AML Index:** https://www.baselgovernance.org/basel-aml-index
- **Transparency International Corruption Perceptions Index:** https://www.transparency.org/en/cpi

### Appendix C: Red Flag Glossary

**Structuring/Smurfing:** Breaking large transactions into multiple smaller transactions to avoid reporting thresholds.

**Layering:** Complex series of transactions designed to obscure the origin of funds (e.g., multiple wire transfers through different countries).

**Round-Tripping:** Funds leaving a country and returning to evade capital controls or taxes.

**Trade-Based Money Laundering (TBML):** Using trade transactions to disguise illicit funds (through over/under-invoicing, phantom shipments, etc.).

**Shell Company:** Company with no significant operations, assets, or employees (used to hide beneficial ownership).

**Nominee:** Person or entity acting on behalf of true owner (to conceal identity).

**Beneficial Owner:** Ultimate individual(s) who own or control ≥25% of entity (or exercise effective control).

**Politically Exposed Person (PEP):** Individual in prominent public position (government, military, state-owned enterprise) or their close associates.

**Front Company:** Legitimate-appearing business used to launder money or facilitate illegal activity.

**Placement:** Initial stage of money laundering (introducing illicit funds into financial system).

**Integration:** Final stage of money laundering (illicit funds appear legitimate and are available for use).

**Predicate Offense:** Underlying crime generating illicit proceeds (drug trafficking, fraud, corruption, etc.).

**Correspondent Banking:** Bank-to-bank relationship to facilitate cross-border transactions.

**Nested Banking:** Use of correspondent account by other banks (creates opacity and compliance risk).

**FATF Grey List:** Countries under increased monitoring due to AML/CFT deficiencies (but committed to action plans).

**FATF Black List:** High-risk countries with significant AML/CFT deficiencies (subject to enhanced due diligence or countermeasures).

**OFAC 50% Rule:** If one or more sanctioned persons own 50% or more of entity, entity is also sanctioned (even if not on SDN list).

### Appendix D: Contact Information

**Internal Escalation:**
- **Compliance Officer:** [compliance@bank.com](mailto:compliance@bank.com) | Ext. 1234
- **Head of Compliance:** [headcompliance@bank.com](mailto:headcompliance@bank.com) | Ext. 1200
- **AML Hotline:** 1-800-XXX-XXXX (24/7)

**External Reporting:**
- **Financial Intelligence Unit (FIU):** [fiu@regulator.gov](mailto:fiu@regulator.gov)
- **Central Bank AML/CFT Division:** [aml@centralbank.gov](mailto:aml@centralbank.gov)
- **OFAC Hotline (US):** 1-800-540-6322

**Correspondent Bank Contacts:**
- **JPMorgan Chase (USD Correspondent):** [correspondent@jpm.com](mailto:correspondent@jpm.com)
- **Deutsche Bank (EUR Correspondent):** [correspondent@db.com](mailto:correspondent@db.com)

### Appendix E: Revision History

| Version | Date | Changes | Approved By |
|---------|------|---------|-------------|
| 1.0 | February 2026 | Initial issuance | Head of Compliance |

---

## Document Approval

**Prepared by:** Compliance Department
**Reviewed by:** Legal Department, Risk Management, Trade Finance Operations
**Approved by:** Chief Compliance Officer, Chief Risk Officer

**Next Review Date:** February 2027

---

*This document is confidential and proprietary to [Bank Name]. Unauthorized distribution is prohibited.*
