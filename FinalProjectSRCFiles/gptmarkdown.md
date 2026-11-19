You
---

 

i need you to help me find a research question for my cybersecurity class It will use a kaggle database that i have already selected and relating to Network intrusion systems. The dataset will be used to create an AI algorithm that will help me answer this question. The scope given by the guidelines are Dataset description and preprocessing. Implementation and comparison of appropriate traditional machine learning models. Identification of the strongest baseline model. Investigation of an advanced AI approach, such as deep learning, LLMs, or hybrid methods, when appropriate. Evaluation using suitable performance metrics. Experimental tables, charts, and visualizations. Analysis of model performance, limitations, and potential improvements. the description for the kaggle notebook is: About Dataset 🌐 Network Intrusion and Cyberattack Dataset (NICA) A comprehensive dataset for building next-generation Intrusion Detection Systems (IDS). 📖 Context As cyber threats become increasingly sophisticated, the need for robust, machine-learning-powered Intrusion Detection Systems (IDS) has never been more critical. This dataset provides a highly detailed, flow-based snapshot of modern network traffic. It combines benign (normal) traffic with a wide variety of simulated cyberattacks, making it a perfect playground for cybersecurity data scientists, researchers, and students to train and evaluate network defense models. 🗄️ Content The dataset consists of 211,043 network flow records across 44 distinct features, capturing detailed information from multiple network layers and protocols. The traffic logs cover connection details, data transfer metrics, and protocol-specific metadata (DNS, HTTP, SSL). Total Records: 211,043 Total Features: 44 Target Variables: \* label: Binary classification (0 = Normal, 1 = Malicious) type: Multi-class classification defining the specific attack category. 🛡️ Threat Categories (type) The dataset is well-balanced across various attack vectors, offering a diverse set of network anomalies: normal: 50,000 records backdoor: 20,000 records ddos: 20,000 records dos: 20,000 records injection: 20,000 records password: 20,000 records ransomware: 20,000 records scanning: 20,000 records xss: 20,000 records mitm (Man-in-the-Middle): 1,043 records 🧬 Feature Highlights The 44 columns provide deep packet-level and flow-level insights, categorized broadly into: Core Flow Attributes: IP addresses, Ports, Protocol (src\_ip, dst\_ip, src\_port, dst\_port, proto, service). Traffic Volume & Duration: Bytes, packets, and time metrics (duration, src\_bytes, dst\_bytes, src\_pkts, dst\_pkts). Connection States: Connection flags and states (conn\_state, missed\_bytes). Protocol-Specific Metadata: DNS: Query strings, types, response codes, and flags (dns\_query, dns\_rcode, etc.). HTTP: Methods, URIs, versions, status codes, and user agents (http\_method, http\_uri, http\_status\_code, etc.). SSL: Cipher suites, versions, and certificate metadata (ssl\_version, ssl\_cipher, etc.). Anomalies: Irregularities detected at the network layer (weird\_name, weird\_notice). 🎯 Potential Use Cases Binary Threat Detection: Build models to accurately predict the label column (0 vs 1) to distinguish malicious traffic from benign. Multi-Class Attack Classification: Use the type column to train models capable of fingerprinting the exact type of cyberattack. Anomaly Detection: Train unsupervised models on the "normal" traffic subset to detect zero-day attacks as statistical outliers. Feature Engineering/Selection: With 44 rich attributes covering different network protocols, this dataset is an excellent resource for practicing dimensionality reduction and feature importance scoring.

ChatGPT
-------

A strong, manageable research question would be:

> **How accurately can traditional machine-learning models and a feed-forward neural network classify the 10 traffic categories in the NICA dataset, and does the neural network improve macro-F1 and detection of the rare MITM class over the strongest traditional baseline?**

This fits your guidelines because it gives you a clear comparison: several traditional models, a neural-network approach, and a focus on both overall performance and a class that is much less common than the others.

### Suggested study design

*   **Target:** `type` — the 10 traffic categories, including normal traffic and nine attack types.
*   **Traditional models:** For example, logistic regression, random forest, and a gradient-boosting model. Choose the strongest baseline based on cross-validation results.
*   **Advanced approach:** A feed-forward neural network (MLP). It is a practical deep-learning method for this dataset’s tabular features.
*   **Evaluation:** Use **macro-F1** as the main metric, because it gives each class equal weight. Also report balanced accuracy, per-class precision and recall, a confusion matrix, and overall accuracy. Pay particular attention to recall for MITM.
*   **Visualizations:** A confusion matrix, per-class performance chart, and model-comparison table would work well.

### Important leakage precaution

When predicting `type`, **do not use `label` as a feature**: it directly indicates whether traffic is normal or malicious and could make the task artificially easy. Likewise, when predicting `label` in a separate binary-classification experiment, do not use `type` as a feature.

Review fields such as IP addresses and other identifiers, too. A model might memorize dataset-specific addresses rather than learn patterns that generalize. You could exclude those fields or compare results with and without them.

Use a stratified train/test split so each class is represented in both sets. Because MITM has only 1,043 records, report its results separately and discuss how its small sample size affects confidence in the findings.

### Possible title

**Comparing Traditional Machine Learning and Neural Networks for Multi-Class Network Intrusion Detection**

If you would rather make the project simpler, you could focus on binary detection (`label`: normal vs. malicious). But the multi-class question is a better fit if you want to investigate which attack types the models can distinguish—and where they struggle.

You
---

 

i wanted you to suggest me multiple research problems

ChatGPT
-------

You’re right—I focused on one option instead of giving you a range. Here are several research questions that fit your dataset and project guidelines.

### Possible research questions

1.  **Traditional versus deep learning for attack classification**
    
    > How does a feed-forward neural network compare with traditional machine-learning models in classifying the NICA dataset’s traffic into normal and specific attack categories?  
    > **Approach:** Predict `type`; compare models such as random forest, gradient boosting, and an MLP. Use macro-F1 and per-class recall.
    
2.  **Binary versus multi-class intrusion detection**
    
    > How does model performance differ between detecting malicious traffic and identifying its specific attack type?  
    > **Approach:** Run one experiment to predict `label` and another to predict `type`. Compare metrics, while excluding `type` when predicting `label` and excluding `label` when predicting `type`.
    
3.  **Effect of class imbalance on rare attack detection**
    
    > How do class-imbalance techniques affect detection of rare attacks, particularly MITM, in the NICA dataset?  
    > **Approach:** Compare a standard model with approaches such as class weighting or oversampling. Focus on MITM recall and macro-F1. Avoid oversampling before the train/test split.
    
4.  **Which network features matter most for intrusion detection?**
    
    > Which flow and protocol features contribute most to accurate classification of network attacks?  
    > **Approach:** Compare feature-selection or feature-importance methods, then evaluate models using all features versus selected subsets. Discuss whether the important features make sense for cybersecurity.
    
5.  **Impact of removing identifying or potentially leaky features**
    
    > Does excluding IP addresses and other identifiers change how well models detect attacks?  
    > **Approach:** Compare models trained with and without identifier-like fields. This tests whether the model is learning general traffic patterns or relying on dataset-specific details.
    
6.  **Explainability and the reliability of intrusion-detection predictions**
    
    > Do explainability methods show that the strongest intrusion-detection model relies on meaningful network features?  
    > **Approach:** Train and compare traditional models, then use feature importance or SHAP to examine why the selected model makes predictions. This is a good choice if your class values interpretable AI.
    
7.  **How well does the model generalize to unseen traffic records?**
    
    > How does the evaluation method affect estimated model performance on the NICA dataset?  
    > **Approach:** Compare a standard stratified random split with a more challenging split, if the dataset has suitable groups such as capture sessions, sources, or time periods. This can reveal whether a random split gives overly optimistic results.
    
8.  **Can anomaly detection identify attacks without attack labels?**
    
    > Can an anomaly-detection model trained only on normal traffic identify malicious network flows?  
    > **Approach:** Train an unsupervised method, such as Isolation Forest, on normal records and evaluate its ability to flag malicious records. Compare it with a supervised baseline. This is interesting, but its results depend heavily on how you set the anomaly threshold.
    

### My recommendations

*   **Best all-around project:** Question 1. It directly supports model comparison and an advanced AI method.
*   **Best cybersecurity-focused question:** Question 3. It investigates a real challenge: detecting rare attack types.
*   **Best project for analysis and interpretation:** Question 4 or 6.
*   **Most ambitious option:** Question 8, since anomaly detection requires extra care in experimental design.

One important precaution: the dataset description says it is “well-balanced,” but MITM has only 1,043 records, compared with 20,000 for most other attack types. Also check for missing values, duplicates, and identifier-like fields. These details can affect which question is most appropriate and how you evaluate the models.

You
---

 

here is additional constraints for the paper to recieve an A grade Comparing at least 10 traditional machine learning models is a recommended benchmark for A-level work, not an automatic guarantee of an A. Strong research should demonstrate: Four completed foundational paper sections: Abstract, Introduction, Related Work, and Proposed Algorithm. A clearly defined research problem and research contribution. At least 10 appropriate traditional machine learning models, when feasible. A fair experimental comparison. A meaningful proposed algorithm or advanced AI approach. Evidence-based results, tables, and visualizations. Critical analysis of findings and limitations. Reproducible implementation and source code. The final grade depends on the overall quality of your research, implementation, experimental design, analysis, and paper—not simply the number of models tested

ChatGPT
-------

These constraints suggest choosing a question that supports **a broad, fair benchmark and a clearly defined contribution**. You can use the same set of at least 10 traditional models for several different research questions; the key is to make the question more specific than “Which model is best?”

Research-question options
-------------------------

### 1\. Detecting rare attacks in multi-class classification — strongest recommendation

> **How do traditional machine-learning models compare with a cost-sensitive neural network in multi-class network intrusion detection, particularly in detecting the underrepresented MITM class?**

*   **Research problem:** A model can achieve good overall accuracy while performing poorly on a rare attack class.
*   **Possible contribution:** A systematic comparison of standard models with a neural network designed to give greater importance to underrepresented classes.
*   **Evaluation:** Macro-F1, balanced accuracy, per-class recall, confusion matrix, and especially MITM recall. Report accuracy too, but do not rely on it alone.
*   **Advanced approach:** A class-weighted neural network, or a neural network trained with a suitable class-imbalance loss.
*   **Why it fits:** It gives you a clear cybersecurity problem, a direct comparison, and a meaningful reason to investigate an advanced approach.

### 2\. Comparing protocol metadata with core traffic-flow features

> **Do DNS, HTTP, and SSL metadata improve network intrusion detection beyond basic flow statistics and connection features?**

*   **Research problem:** It is not clear whether protocol-specific metadata adds useful information beyond features such as duration, bytes, packets, and ports.
*   **Possible contribution:** An ablation study that measures the value of different feature groups.
*   **Evaluation:** Compare performance using core flow features alone, protocol metadata alone, and all suitable features.
*   **Advanced approach:** A neural network or feature-fusion model that combines feature groups.
*   **Important condition:** First check that the dataset actually contains usable, nonempty values for the DNS, HTTP, and SSL fields.

### 3\. Testing whether models rely on identifiers rather than traffic behavior

> **How does removing IP addresses and other identifier-like features affect model performance and generalizability?**

*   **Research problem:** A model may memorize dataset-specific identifiers instead of learning traffic patterns that could transfer to new networks.
*   **Possible contribution:** A controlled comparison of results with and without fields such as source and destination IP addresses.
*   **Evaluation:** Compare macro-F1 and per-class recall across both feature sets, using identical data splits and model-tuning procedures.
*   **Advanced approach:** A neural network or ensemble evaluated on the identifier-free feature set.
*   **Caution:** If the dataset includes capture sessions, timestamps, or meaningful groups, a group-based split may provide a stronger test of generalization. Do not assume such fields exist; inspect the data first.

### 4\. Building an interpretable intrusion-detection model

> **Can a high-performing intrusion-detection model be made more interpretable without substantially reducing its classification performance?**

*   **Research problem:** A model may detect attacks accurately but provide little insight into which features influenced its decisions.
*   **Possible contribution:** A comparison of model performance and interpretability, including whether explanations differ across attack types.
*   **Evaluation:** Compare predictive metrics before and after feature selection, and examine feature importance or SHAP explanations.
*   **Advanced approach:** An MLP with post-hoc explanations, compared with interpretable traditional models such as decision trees.
*   **Caution:** Feature-importance results describe model behavior; they do not establish that a feature causes an attack.

### 5\. Comparing flat and hierarchical attack classification

> **Does a two-stage classifier—first distinguishing normal from malicious traffic, then identifying the attack type—perform better than a single multi-class classifier?**

*   **Research problem:** A single classifier must distinguish all classes at once; a staged system may make the task more manageable, but errors in the first stage can affect the second.
*   **Possible contribution:** A fair comparison between flat multi-class classification and a two-stage detection-and-identification system.
*   **Evaluation:** Compare macro-F1 and per-class recall, and report how often errors in the first stage lead to mistakes in the second.
*   **Advanced approach:** A neural-network-based cascade or a two-stage ensemble.
*   **Caution:** The first stage must be evaluated honestly; do not treat its predictions as perfect when evaluating the second stage.

A suitable 10-model benchmark
-----------------------------

For a tabular dataset like this one, you could consider:

1.  Logistic Regression
2.  Gaussian Naive Bayes
3.  K-Nearest Neighbors
4.  Decision Tree
5.  Linear SVM
6.  RBF SVM
7.  Random Forest
8.  Extra Trees
9.  Gradient Boosting
10.  AdaBoost
11.  HistGradientBoosting, XGBoost, LightGBM, or CatBoost, if available and feasible

Choose models that you can actually run and explain. Apply suitable preprocessing—such as scaling for models that need it—and tune them fairly. For categorical fields, decide on a consistent encoding strategy. Keep resampling or other imbalance treatments **inside the training data only** to avoid data leakage.

My recommendation
-----------------

I would choose **Option 1**. It gives the paper a focused problem, a defensible reason to compare many traditional models, and a clear advanced approach. A possible title is:

> **Benchmarking Traditional Machine Learning and Cost-Sensitive Neural Networks for Multi-Class Network Intrusion Detection**

For any option, verify the dataset’s actual columns, missing values, duplicate records, class distribution, and potential leakage before settling on the final question. Your four foundational sections can then follow the research logic: introduce the security problem, review related IDS work, define the gap and contribution, and describe your proposed method in detail. Comparing 10 models can strengthen the paper, but—as your guidelines note—it is the quality and fairness of the study, not just the model count, that matters.

You
---

 

could you explain the caution in research problem 3

ChatGPT
-------

The caution is that **removing IP addresses alone may not prove that a model generalizes to new network traffic**.

A random train/test split can put records from the same device, capture session, or traffic source in both sets. The model may then recognize patterns specific to those repeated records—even without IP addresses—and score well on the test set, while performing worse on genuinely new traffic.

If the dataset contains meaningful grouping information, such as capture session, source device, or time period, a stronger test is to keep entire groups separate: train on some groups and test on groups the model has never seen. This is called a **group-based split**. You could then compare:

*   **Random split:** estimates performance on records drawn similarly to the training data.
*   **Group-based split:** tests performance on unseen groups, giving a tougher test of generalization.
*   **Features with identifiers vs. without identifiers:** shows whether identifiers appear to help the model.

The key limitation is that the dataset may not contain reliable session, device, or time-group fields. If it does not, you should not invent groups or claim that a random split proves performance on new networks. Instead, state that generalization beyond this dataset could not be fully tested.

Also, IP addresses are not automatically “bad” features. They may contain useful information in a real IDS, but the model could learn dataset-specific address patterns rather than reusable signs of attacks. Comparing models with and without them helps assess that risk.

You
---

 

alright then could you give me an outline to finish these sections of the paper. Abstract: Summarize the research problem, objectives, methodology, experimental approach, key findings, and contributions. You may initially draft the abstract and finalize the experimental findings after completing your experiments. Introduction: Explain the research background, problem significance, research challenges, research objectives, research questions, and main contributions. Related Work: Review relevant existing research, compare previous methods, identify research gaps, and explain how your work differs from or improves upon existing approaches. Use appropriate academic references, preferably recent IEEE, ACM, Springer, and Elsevier publications. Proposed Algorithm: Clearly describe your proposed method, including its architecture, workflow, mathematical formulation (when appropriate), implementation steps, and expected advantages over existing methods. Include an algorithm flowchart or pseudocode where appropriate.

ChatGPT
-------

Below is an outline tailored to the research problem we discussed: **testing whether network intrusion classifiers rely on IP addresses and whether removing those features changes performance**. It assumes you will predict the 10 traffic categories in `type`, compare at least 10 traditional models, and include a neural network as the advanced approach.

Working title
-------------

**Do Network Intrusion Classifiers Rely on IP Addresses? An Identifier-Ablation Study of Traditional Machine Learning and Neural Networks**

Proposed research question
--------------------------

> **How does removing source and destination IP address features affect the performance of traditional machine-learning models and a neural network in classifying network traffic, and what do the results suggest about their reliance on dataset-specific identifiers?**

A useful limitation to state from the beginning: unless the dataset contains reliable session, device, or time-group information that supports a group-based test split, this study can measure the effect of removing IP features **within this dataset**, but cannot establish that the models will generalize to entirely new networks.

Experimental plan at a glance
-----------------------------

*   **Prediction target:** `type`, the multiclass attack category.
*   **Feature sets:**
    *   **Full-feature set:** all usable predictor features, excluding targets and any confirmed leakage fields.
    *   **No-IP set:** the same predictors, but without `src_ip` and `dst_ip`.
*   **Models:** at least 10 suitable traditional models, plus a feed-forward neural network.
*   **Main comparison:** test every model on both feature sets, using the same data split and tuning process.
*   **Primary metric:** macro-F1, because it treats each class equally.
*   **Additional metrics:** balanced accuracy, per-class precision and recall, accuracy, and confusion matrices.
*   **Key interpretation:** a large performance drop without IP addresses may indicate that models relied on those features in this dataset; it does not by itself prove that the models learned no useful traffic patterns.

* * *

1\. Abstract
============

Write the abstract last, once you have actual experimental results. For now, use the following as a template:

> Network intrusion detection systems (IDS) use traffic features to identify benign activity and attacks. However, classifiers may rely on source and destination IP addresses that are specific to the dataset rather than on patterns that transfer to other environments. This study investigates **\[state the problem\]** using the Network Intrusion and Cyberattack (NICA) dataset. We compare **\[number\]** traditional machine-learning models and a feed-forward neural network across two feature sets: **\[describe full-feature set\]** and **\[describe set excluding IP addresses\]**. Models are evaluated using **\[describe splitting and validation method\]**, with macro-F1 as the primary metric and **\[list supporting metrics\]** as additional measures. The results show that **\[insert measured result—do not write this before experiments\]**. These findings suggest **\[careful interpretation\]**. The study contributes **\[state the experimental comparison and any practical or methodological contribution\]**, while noting limitations related to **\[such as the dataset, available grouping fields, or test design\]**.

Aim for roughly **150–250 words**, depending on your instructor’s requirements. Avoid claiming “improved generalization to new networks” unless your experiments actually test on data from separate networks or groups.

* * *

2\. Introduction
================

2.1 Background
--------------

Explain:

*   What network intrusion detection systems do.
*   Why machine learning is used to classify network traffic.
*   Why detecting the specific type of attack can be useful, beyond simply distinguishing normal from malicious traffic.
*   Why feature quality and evaluation design matter for IDS research.

Introduce the NICA dataset briefly, but save detailed preprocessing and dataset statistics for the methodology or dataset section.

2.2 Problem significance
------------------------

Explain the concern behind your study:

*   IP addresses may help identify known devices or traffic sources.
*   That can improve predictions on a dataset where similar addresses appear in both training and test data.
*   But a model’s performance may change when those addresses are unavailable or differ in another deployment environment.
*   Therefore, it is useful to test how performance changes when IP address features are excluded.

Be balanced: IP addresses can be legitimate and useful IDS features. Your study is not assuming that they are inherently inappropriate; it is measuring their effect.

2.3 Research problem and gap
----------------------------

Describe the specific problem as an evaluation question:

> A high test score does not necessarily show that a classifier has learned traffic characteristics that will remain useful when identifier-like features change. This study tests the effect of removing IP address features under a controlled model comparison.

Use your literature review to determine how to describe the gap. Do not claim that no prior work has studied this issue until you have checked relevant papers.

2.4 Objectives
--------------

You could use these objectives:

1.  Inspect and preprocess the NICA dataset for multiclass attack classification.
2.  Compare at least 10 traditional machine-learning models on a consistent evaluation setup.
3.  Evaluate how each model’s performance changes when source and destination IP addresses are excluded.
4.  Compare the strongest traditional baseline with a feed-forward neural network.
5.  Analyze per-class results, including performance on the less-represented MITM class.
6.  Discuss what the experiment can and cannot establish about model reliance and generalization.

2.5 Research questions
----------------------

Use one main question and supporting questions:

*   **RQ1:** How does removing `src_ip` and `dst_ip` affect multiclass classification performance across the tested models?
*   **RQ2:** Does the effect of removing these features differ between model families?
*   **RQ3:** How do the two feature sets affect recall and F1-score for individual attack classes, particularly MITM?
*   **RQ4:** Does the neural network outperform the strongest traditional baseline under both feature sets?

2.6 Contributions
-----------------

State contributions you can actually deliver. For example:

1.  A controlled comparison of at least 10 traditional classifiers across two feature sets.
2.  An evaluation of the effect of source and destination IP address features on overall and per-class performance.
3.  A comparison between the strongest traditional baseline and a neural-network approach.
4.  A reproducible experimental workflow, including preprocessing, model settings, evaluation metrics, and code.

Call these **study contributions**, not necessarily a new IDS algorithm. The work can be valuable as a careful empirical study without claiming to invent a new classifier.

* * *

3\. Related Work
================

Organize this section by themes rather than summarizing papers one at a time.

3.1 Machine learning for network intrusion detection
----------------------------------------------------

Review studies that use traditional classifiers for binary or multiclass IDS tasks. Compare:

*   Dataset and prediction target.
*   Feature types and preprocessing.
*   Models tested.
*   Evaluation metrics and validation setup.
*   Main results and reported limitations.

3.2 Deep learning for intrusion detection
-----------------------------------------

Review relevant work using MLPs or other deep-learning models on tabular or flow-based network data. Discuss when deep learning appears useful and whether it is compared fairly with traditional models.

3.3 Feature selection, identifiers, and data leakage
----------------------------------------------------

Find research discussing:

*   Feature selection or feature ablation in IDS.
*   IP addresses, ports, timestamps, or other potentially identifying features.
*   Data leakage, duplicate records, or overly optimistic random splits.
*   Generalization across datasets, time periods, devices, or network environments.

Be precise: IP addresses and ports are not automatically leakage. The concern is whether a model’s apparent performance depends on dataset-specific patterns that may not transfer.

3.4 Evaluation methods for imbalanced multiclass data
-----------------------------------------------------

Discuss why accuracy alone can hide poor performance on smaller classes. Review the use of:

*   Macro-F1.
*   Balanced accuracy.
*   Per-class precision and recall.
*   Confusion matrices.
*   Stratified or group-based validation, where appropriate.

This is particularly relevant because MITM is much less represented than most other categories in the dataset description.

3.5 Research gap and positioning
--------------------------------

End the section by explaining how your study differs from the papers reviewed. A defensible positioning might be:

> Rather than proposing that IP features should always be removed, this study measures how their inclusion affects a consistent set of traditional classifiers and a neural network on the NICA dataset. It reports both overall and per-class performance and interprets the results within the limits of the available evaluation design.

Support this statement with the literature you actually find. Use recent and relevant IEEE, ACM, Springer, and Elsevier publications where available, alongside foundational papers when appropriate. Verify each reference from the original publication or a reliable academic index; do not rely only on search-result summaries.

* * *

4\. Proposed Algorithm and Experimental Workflow
================================================

4.1 Name and purpose
--------------------

You could describe your proposed method as an **Identifier-Ablation Evaluation Framework**. This is best presented as a **structured experimental method**, not as a novel classifier.

Its purpose is to compare models under two controlled conditions: with and without IP address features.

4.2 Dataset inspection and preprocessing
----------------------------------------

Document each step and report what you observe:

1.  Load the dataset and confirm its actual columns, row count, class distribution, and data types.
2.  Check for missing values, duplicate records, invalid values, and constant or nearly constant features.
3.  Set `type` as the target.
4.  Exclude `label` from the predictors because it reveals whether a record is normal or malicious. Also exclude any other fields that directly encode the target, if found.
5.  Create the two feature sets:
    *   **Full:** all eligible features.
    *   **No-IP:** the same features except `src_ip` and `dst_ip`.
6.  Apply transformations appropriately:
    *   Scale numeric features for models that need scaling.
    *   Encode categorical features using a method appropriate to the model and data.
    *   Handle missing values using values learned from training data only.
7.  Fit preprocessing separately within each training fold or pipeline to prevent leakage.

Inspect the actual dataset before finalizing the feature lists. Do not assume every advertised field exists or is populated.

4.3 Traditional models and advanced model
-----------------------------------------

A possible traditional benchmark is:

1.  Logistic Regression
2.  Gaussian Naive Bayes
3.  K-Nearest Neighbors
4.  Decision Tree
5.  Linear SVM
6.  RBF SVM
7.  Random Forest
8.  Extra Trees
9.  Gradient Boosting
10.  AdaBoost

You may substitute other feasible models, such as HistGradientBoosting, XGBoost, LightGBM, or CatBoost, depending on your software environment and course requirements.

The advanced model can be a **feed-forward neural network (MLP)** with an input layer, one or more hidden layers, dropout or other regularization if appropriate, and a softmax output for the 10 classes. Explain the final architecture you actually implement rather than describing one you did not test.

4.4 Fair experimental comparison
--------------------------------

For a fair comparison:

*   Use the same train/test records for both feature sets and all models.
*   Use a stratified split so class proportions are represented in each partition.
*   Tune hyperparameters using only the training data, for example with cross-validation.
*   Keep the test set untouched until final evaluation.
*   If using oversampling or class-weighting, apply it only within training folds.
*   Use appropriate preprocessing for each model, but apply it through leakage-safe pipelines.
*   Report the tuning method and important settings.
*   Use multiple random seeds or repeated cross-validation if feasible.

If the dataset contains credible session, device, or time-group fields, consider a group-based split as an additional experiment. If it does not, say so, and do not describe a random split as a test of performance on unseen networks.

4.5 Evaluation metrics
----------------------

Use **macro-F1 as your primary metric**:

\[  
\\text{Macro-F1} = \\frac{1}{K}\\sum\_{k=1}^{K} F1\_k  
\]

where (K) is the number of classes and (F1\_k) is the F1-score for class (k).

Also report:

*   Overall accuracy.
*   Balanced accuracy.
*   Per-class precision, recall, and F1-score.
*   Confusion matrices.
*   The performance difference between feature sets for each model.

For each model (m), define the change in macro-F1 as:

\[  
\\Delta\_m = \\text{Macro-F1}_{m,\\text{No-IP}} -  
\\text{Macro-F1}_{m,\\text{Full}}  
\]

A negative value means that the model’s macro-F1 decreased after IP features were removed. Interpret this as a change in performance on your evaluation setup, not proof of why the model behaved that way.

4.6 Pseudocode
--------------

```text
Input: Dataset D, target column type,
       IP features I = {src_ip, dst_ip},
       traditional models M, neural network N

1. Inspect D; check missing values, duplicates, class counts, and data types.
2. Set y = D[type].
3. Remove type, label, and any confirmed leakage fields from predictors X.
4. Create:
       X_full = X
       X_no_ip = X excluding I
5. Create one stratified train/test split.
6. For each feature set in {X_full, X_no_ip}:
       a. For each traditional model m in M:
              i. Tune m using training data only.
             ii. Fit its preprocessing and model on the training data.
            iii. Evaluate once on the test data.
       b. Tune, train, and evaluate the neural network using the same split.
7. Record overall metrics, per-class metrics, and confusion matrices.
8. Calculate the performance difference between feature sets.
9. Compare results and discuss limitations.
Output: Model comparison tables, visualizations, and analysis.
```

4.7 Flowchart
-------------

Your flowchart can follow this structure:

```text
Load and inspect dataset
          ↓
Clean data and check for leakage
          ↓
Select target: type
          ↓
Create full and no-IP feature sets
          ↓
Create identical stratified train/test split
          ↓
Tune and train models using training data only
          ↓
Evaluate on held-out test data
          ↓
Compare overall and per-class metrics
          ↓
Interpret results and limitations
```

4.8 Expected advantages and limitations
---------------------------------------

Describe expected advantages carefully:

*   The paired feature-set design isolates the effect of removing IP features more clearly than comparing unrelated experiments.
*   Using many model families can show whether the effect is model-dependent.
*   Per-class metrics can reveal trade-offs hidden by overall accuracy.
*   The neural-network comparison tests whether the same feature change affects a more flexible model differently.

Also state limitations you will examine:

*   The results may depend on this dataset’s feature distributions and collection process.
*   Random train/test splitting may not test truly unseen devices or networks.
*   The low MITM sample count may make its performance estimates less stable.
*   Removing IP addresses does not remove every possible source of dataset-specific information.
*   Performance changes do not, on their own, explain the exact reasons a model uses particular features.

Suggested results tables and figures
------------------------------------

Although your question is about the foundational sections, plan these early:

1.  **Dataset table:** class counts, missing values, and feature types.
2.  **Model comparison table:** metrics for each model under both feature sets.
3.  **Per-class results table:** especially MITM precision, recall, and F1.
4.  **Macro-F1 comparison chart:** grouped bars for full versus no-IP features.
5.  **Confusion matrices:** for the strongest baseline and the neural network.
6.  **Performance-change chart:** (\\Delta\_m) for each model.

In the final paper, use actual results in the abstract and discussion, distinguish measured findings from expectations, and make your code, random seeds, preprocessing choices, and model settings available for reproducibility.