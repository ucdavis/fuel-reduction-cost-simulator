Ground-Based Mech WT
====================

![https://documents.lucidchart.com/documents/ee6699d8-df0d-44ba-bdf5-bcce7a511275/pages/DCtQUqKTtDZl?a=2536&x=-17&y=1031&w=1234&h=178&store=1&accept=image%2F\*&auth=LCA%20215336b586e79ffc0072055a8a3b208e5915f475-ts%3D1551045566](media/ea2ab102557b4fece52d2489d099abbc.png)

**INTERFACE PAGE**
------------------

Input (test data entered)

![](media/9f0de5bc5183cd1ce45583918b3acc59.emf)

![](media/ba88db86d0b9e149d8574b7be8289afe.emf)

Output

![](media/557c7ffb1df9d828df617f786b72fe41.emf)

**INPUTS**
----------

### Inputs

![](media/a9ae125a40440cab3696e35261cc0897.emf)

### Inputs for Cut Trees

![](media/55e7814a03a3480df10911bf84e66471.emf)

**All cells highlighted in blue are the inputs entered in interface page.**

CT – Chip Trees

SLT – Small Log Trees (\<=80 ft3)

LLT – Large Log Trees (\>80 ft3)

SL – Small Trees (\<=80 ft3)

ALT – All Log Trees

AT – All Trees

Removals – Removals, trees/acre

TreeVol – Tree Volume, ft3

RemovalsST = RemovalsCT + RemovalsSLT

RemovalsALT = RemovalsSLT + RemovalsLLT

Removals = RemovalsCT + RemovalsSLT + RemovalsLLT

#### Tree Volume Per Acre for Small Trees

TreeVolST = IF(RemovalsST\>0,VolPerAcreST/RemovalsST,0)

VolPerAcreST = VolPerAcreCT + VolPerAcreSLT

VolPerAcreCT = RemovalsCT \* TreeVolCT

VolPerAcreSLT = RemovalsSLT \* TreeVolSLT

#### Tree Volume Per Acre for All Log Trees

TreeVolALT = IF(RemovalsALT\>0,VolPerAcreALT/RemovalsALT,0)

VolPerAcreALT = VolPerAcreSLT + VolPerAcreLLT

VolPerAcreSLT = RemovalsSLT \* TreeVolSLT

VolPerAcreLLT = RemovalsLLT \* TreeVolLLT

#### Tree Volume Per Acre for All Trees

TreeVol = IF(Removals\>0,VolPerAcre/Removals,0)

VolPerAcre = VolPerAcreCT + VolPerAcreSLT + VolPerAcreLLT

### Other Assumptions

![](media/47f0c41201cf6fd27e1e6a0d8e617e61.emf)

### Calculated Intermediates

![](media/67e193382bcbcc614d0368a6b06d694d.emf)

#### DBH

DBHCT – DBH for chip trees, in

DBHSLT – DBH for small log trees, in

DBHLLT – DBH for large log trees, in

DBHST – DBH for small trees, in

DBHALT – DBH for all log trees, in

DBH – DBH for all trees, in

DBHCT

=IF(TreeVolCT\>0,IF(ISNUMBER(UserSpecDBHCT),UserSpecDBHCT,SQRT((TreeVolCT+3.675)/0.216)),0)

DBHSLT
=IF(TreeVolSLT\>0,IF(ISNUMBER(UserSpecDBHSLT),UserSpecDBHSLT,SQRT((TreeVolSLT+3.675)/0.216)),0)

DBHLLT
=IF(TreeVolLLT\>0,IF(ISNUMBER(UserSpecDBHLLT),UserSpecDBHLLT,SQRT((TreeVolLLT+3.675)/0.216)),0)

DBHST =
IF(TreeVolST\>0,SQRT((RemovalsCT\*DBHCT\^2+RemovalsSLT\*DBHSLT\^2)/RemovalsST),0)

DBHALT
=IF(TreeVolALT\>0,SQRT((RemovalsSLT\*DBHSLT\^2+RemovalsLLT\*DBHLLT\^2)/RemovalsALT),0)

DBH= SQRT((RemovalsCT\*DBHCT\^2+RemovalsALT\*DBHALT\^2)/Removals)

$$
DBHCT = \sqrt{\frac{TreeVolCT + 3.675}{0.216}}
$$

$$
DBHSLT = \sqrt{\frac{TreeVolSL + 3.675}{0.216}}
$$

$$
DBHLLT = \sqrt{\frac{TreeVolLLT + 3.675}{0.216}}
$$

$$
DBHST = \sqrt{\frac{RemovalsCT \times \text{DBHCT}^{2} + RemovalsSLT \times \text{DBHSLT}^{2}}{\text{RemovalsST}}}
$$

$$
DBHALT = \sqrt{\frac{RemovalsSLT \times \text{DBHSLT}^{2} + RemovalsLLT \times \text{DBHLLT}^{2}}{\text{RemovalsALT}}}
$$

$$
DBH = \sqrt{\frac{RemovalsCT \times \text{DBHCT}^{2} + RemovalsALT \times \text{DBHALT}^{2}}{\text{Removals}}}
$$

#### Tree Height

HeightCT

=IF(TreeVolCT\>0,IF(ISNUMBER(UserSpecHeightCT),UserSpecHeightCT,-20+24\*SQRT(DBHCT)),0)

HeightSLT

=IF(TreeVolSLT\>0,IF(ISNUMBER(UserSpecHeightSLT),UserSpecHeightSLT,-20+24\*SQRT(DBHSLT)),0)

HeightLLT

=IF(TreeVolLLT\>0,IF(ISNUMBER(UserSpecHeightLLT),UserSpecHeightLLT,-20+24\*SQRT(DBHLLT)),0)

HeightST =
IF(TreeVolST\>0,(RemovalsCT\*HeightCT+RemovalsSLT\*HeightSLT)/RemovalsST,0)

HeightALT =
IF(TreeVolALT\>0,(RemovalsSLT\*HeightSLT+RemovalsLLT\*HeightLLT)/RemovalsALT,0)

HeightAT =
IF(TreeVol\>0,(RemovalsCT\*HeightCT+RemovalsALT\*HeightALT)/RemovalsAT,0)

$$
HeightCT = - 20 + 24 \times \sqrt{\text{DBHCT}}
$$

$$
HeightSLT = = - 20 + 24 \times \sqrt{\text{DBHSLT}}
$$

$$
HeightLLT = = - 20 + 24 \times \sqrt{\text{DBHLLT}}
$$

$$
HeightST = \frac{RemovalsCT \times HeightCT + RemovalsSLT \times HeightSLT}{\text{RemovalsST}}
$$

$$
HeightALT = \frac{RemovalsSLT \times HeightSLT + RemovalsLLT \times HeightLLT}{\text{RemovalsALT}}
$$

$$
HeightALT = \frac{RemovalsCT \times HeightCT + RemovalsALT \times HeightALT}{\text{RemovalsALT}}
$$

#### Wood Density

**If wood density for chip trees, small log trees or large log trees is not
specified by users, then it is 50 lb/ft3 as default.**

WoodDensityCT =IF(UserSpecWDCT\>0,UserSpecWDCT,50)

WoodDensitySLT =IF(UserSpecWDSLT\>0,UserSpecWDSLT,50)

WoodDensityLLT =IF(UserSpecWDLLT\>0,UserSpecWDLLT,50)

WoodDensityST
=IF(VolPerAcreST\>0,(WoodDensityCT\*VolPerAcreCT+WoodDensitySLT\*VolPerAcreSLT)/VolPerAcreST,0)

WoodDensityALT
=IF(VolPerAcreALT\>0,(WoodDensitySLT\*VolPerAcreSLT+WoodDensityLLT\*VolPerAcreLLT)/VolPerAcreALT,0)

WoodDensity
=(WoodDensityCT\*VolPerAcreCT+WoodDensityALT\*VolPerAcreALT)/VolPerAcre

$$
WoodDensityST = \frac{WoodDensityCT \times VolPerAcreCT + WoodDensitySLT \times VolPerAcreSLT}{\text{VolPerAcreST}}
$$

$$
WoodDensityALT = \frac{WoodDensitySLT \times VolPerAcreSLT + WoodDensityLLT \times VolPerAcreLLT}{\text{VolPerAcreALT}}
$$

$$
WoodDensity = \frac{WoodDensityCT \times VolPerAcreCT + WoodDensityALT \times VolPerAcreALT}{\text{VolPerAcre}}
$$

#### Hardwood Fraction

**If hardwood fraction for chip trees, small log trees or large log trees is not
specified by users, then it is 0 as default.**

HdwdFractionCT =IF(ISNUMBER(User-SpecHFCT), User-SpecHFCT,0)

HdwdFractionSLT =IF(ISNUMBER(User-SpecHFSLT), User-SpecHFSLT,0)

HdwdFractionLLT =IF(ISNUMBER(User-SpecHFLLT), User-SpecHFLLT,0)

HdwdFractionST
=IF(VolPerAcreST\>0,(HdwdFractionCT\*VolPerAcreCT+HdwdFractionSLT\*VolPerAcreSLT)/VolPerAcreST,0)

HdwdFractionALT
=IF(VolPerAcreALT\>0,(HdwdFractionSLT\*VolPerAcreSLT+HdwdFractionLLT\*VolPerAcreLLT)/VolPerAcreALT,0)

HdwdFraction
=(HdwdFractionCT\*VolPerAcreCT+HdwdFractionALT\*VolPerAcreALT)/VolPerAcre

$$
HdwdFractionST = \frac{HdwdFractionCT \times VolPerAcreCT + HdwdFractionSLT \times VolPerAcreSLT}{\text{VolPerAcreST}}
$$

$$
HdwdFractionALT = \frac{HdwdFractionSLT \times VolPerAcreSLT + HdwdFractionLLT \times VolPerAcreLLT}{\text{VolPerAcreALT}}
$$

$$
HdwdFraction = \frac{HdwdFractionCT \times VolPerAcreCT + HdwdFractionALT \times VolPerAcreALT}{\text{VolPerAcre}}
$$

#### Butt Diameter

$$
ButtDiamSLT = DBHSLT + 3
$$

$$
ButtDiamST = DBHST + 3
$$

#### Logs Per Tree

**Logs per chip tree was assumed as 1.**

LogsPerTreeCT = 1

LogsPerTreeSLT= (-0.43+0.678\*SQRT(DBHSLT))

LogsPerTreeLLT= (-0.43+0.678\*SQRT(DBHLLT))

LogsPerTreeST
=(LogsPerTreeCT\*RemovalsCT+LogsPerTreeSLT\*RemovalsSLT)/RemovalsST

LogsPerTreeALT
=IF(RemovalsALT=0,0,((LogsPerTreeSLT\*RemovalsSLT+LogsPerTreeLLT\*RemovalsLLT)/RemovalsALT))

LogsPerTreeAT =(LogsPerTreeCT\*RemovalsCT+LogsPerTreeALT\*RemovalsALT)/Removals

$$
LogsPerTreeCT = 1
$$

$$
LogsPerTreeSLT = - 0.43 + 0.678 \times \sqrt{\text{DBHSLT}}
$$

$$
LogsPerTreeLLT = - 0.43 + 0.678 \times \sqrt{\text{DBHLLT}}
$$

$$
LogsPerTreeST = \frac{LogsPerTreeCT \times RemovalsCT + LogsPerTreeSLT \times RemovalsSLT}{\text{RemovalsST}}
$$

$$
LogsPerTreeALT = \frac{LogsPerTreeSLT \times RemovalsSLT + LogsPerTreeLLT \times RemovalsLLT}{\text{RemovalsALT}}
$$

$$
LogsPerTree = \frac{LogsPerTreeCT \times RemovalsCT + LogsPerTreeALT \times RemovalsALT}{\text{Removals}}
$$

#### Log Volume

LogVolST =TreeVolST/LogsPerTreeST

LogVolALT =IF(RemovalsALT=0,0,TreeVolALT/LogsPerTreeALT)

LogVolAT =TreeVol/LogsPerTree

$$
LogVolST = \frac{\text{TreeVolST}}{\text{LogsPerTreeST}}
$$

$$
LogVolALT = \frac{\text{TreeVolALT}}{\text{LogsPerTreeALT}}
$$

$$
LogVol = \frac{\text{TreeVol}}{\text{LogsPerTree}}
$$

#### CTL Logs Per Tree

For the Mech WT system, no idea about what the following CTL values used for?

CTLLogsPerTreeCT= MAX(1,2\*(-0.43+0.678\*SQRT(DBHCT)))

CTLLogsPerTree=MAX(1,2\*(-0.43+0.678\*SQRT(DBHST)))

#### CTL Log Volume

CTLLogVolCT=TreeVolCT/CTLLogsPerTreeCT

CTLLogVol=TreeVolST/CTLLogsPerTree

#### BFperCF

BFperCF=5 (not sure what it is)

#### Bole Weight

BoleWtCT =WoodDensityCT\*VolPerAcreCT/2000

BoleWSLT =WoodDensitySLT\*VolPerAcreSLT/2000

BoleWtLLT =WoodDensityLLT\*VolPerAcreLLT/2000

BoleWtST =BoleWtCT+BoleWtSLT

BoleWtALT =BoleWtSLT+BoleWtLLT

BoleWtAT =BoleWtCT+BoleWtALT

$$
BoleWtCT = \frac{WoodDensityCT \times VolPerAcreCT}{2000}
$$

$$
BoleWtSLT = \frac{WoodDensitySLT \times VolPerAcreSLT}{2000}
$$

$$
BoleWtLLT = \frac{WoodDensityLLT \times VolPerAcreLLT}{2000}
$$

$$
BoleWtST = BoleWtCT + BoleWtSLT
$$

$$
BoleWtALT = BoleWtSLT + BoleWtLLT
$$

$$
BoleWtAT = BoleWtCT + BoleWtALT
$$

#### Residue Weight

ResidueCT =UserSpecRFCT\*BoleWtCT

ResidueSLT =UserSpecRFSLT\*BoleWtSLT

ResidueLLT =UserSpecRFLLT\*BoleWtLLT

ResidueST =ResidueCT+ResidueSLT

ResidueALT =ResidueSLT+ResidueLLT

ResidueAT =ResidueCT+ResidueALT

$$
BoleWtCT = UserSpecRFCT + BoleWtCT
$$

$$
BoleWtSLT = UserSpecRFSLT + BoleWtSLT
$$

$$
BoleWtLLT = UserSpecRFLLT + BoleWtLLT
$$

$$
BoleWtST = ResidueCT + ResidueSLT
$$

$$
BoleWtALT = ResidueSLT + ResidueLLT
$$

$$
BoleWtAT = ResidueCT + ResidueALT
$$

#### Manual Machine Size

ManualMachineSizeALT=MIN(1,TreeVolALT/MaxManualTreeVol)

ManualMachineSize=MIN(1,TreeVol/MaxManualTreeVol)

Again, for the Mech WT system, it doesn’t make sense that Manual related values
were calculated in the FRCS spreadsheet. Perhaps it was just calculated with no
meaning and also not involved in the later calculation.

#### Mechanized Machine Size 

MechMachineSize=MIN(1,TreeVolST/MaxMechTreeVol)

#### Chipper Size

ChipperSize=MIN(1,TreeVolCT/MaxMechTreeVol)

#### NonSelfLevelCabDummy

NonSelfLevelCabDummy=IF(Slope\<15,1,IF(Slope\<35,1.75-0.05\*Slope,0))

$$
\text{NonSelfLevelCabDummy}_{slope < 15} = 1
$$

$$
\text{NonSelfLevelCabDummy}_{15 < slope < 35} = 1.75 - 0.05 \times Slope
$$

$$
\text{NonSelfLevelCabDummy}_{slope > 35} = 0
$$

I don’t know what NonSelfLevelCabDummy means

#### CSlopeFB&Harv (Mellgren 90)

CSlopeFB_Harv =0.00015\*Slope\^2+0.00359\*NonSelfLevelCabDummy\*Slope

$$
\text{CSlope}\text{FB}_{\text{Harv}} = 0.00015 \times \text{Slope}^{2} + 0.00359 \times NonSelfLevelCabDummy \times Slope
$$

#### CRemovalsFB&Harv (Mellgren 90)

CRemovalsFB_Harv
=MAX(0,0.66-0.001193\*RemovalsST\*2.47+5.357\*10\^-7\*(RemovalsST\*2.47)\^2)

$$
\text{CRemovals}\text{FB}_{\text{Harv}} = 0.66 - 0.001193 \times RemovalsST \times 2.47 + 5.357 \times 10^{- 7} \times {(RemovalsST \times 2.47)}^{2}
$$

#### CSlopeSkidForwLoadSize (Mellgren 90)

CSlopeSkidForwLoadSize =1-0.000127\*Slope\^2

$$
CSlopeForwLoadSize = 1 - 0.000127 \times \text{Slope}^{2}
$$

#### Chardwood

CHardwoodCT =1+HdwdCostPremium\*HdwdFractionCT

CHardwoodSLT =1+HdwdCostPremium\*HdwdFractionSLT

CHardwoodLLT =1+HdwdCostPremium\*HdwdFractionLLT

CHardwoodST =1+HdwdCostPremium\*HdwdFractionST

CHardwoodALT =1+HdwdCostPremium\*HdwdFractionALT

CHardwoodAT =1+HdwdCostPremium\*HdwdFractionAT

**OUTPUTS**
-----------

### System Product Summary

#### Amounts Recovered Per Acre

![](media/51d49505244f4a4fb6f93108b872358c.emf)

ResidueRecoveredPrimary – WT residue recovered as part of primary product, GT/ac

ResidueRecoveredOptional – Optional residue recovered, GT/ac

ResidueRecoveredPrimary=ResidueRecovFracWT\*ResidueCT

PrimaryProduct=BoleWT+ ResidueRecoveredPrimary

ResidueRecoveredOptional
=IF(CalcResidues=1,(ResidueRecovFracWT\*ResidueSLT)+(ResidueRecovFracWT\*ResidueLLT),0)

TotalPrimaryAndOptional=PrimaryProduct+ ResidueRecoveredOptional

#### Amounts Unrecovered and Left within the Stand Per Acre

![](media/ebe219bb2594caf88b6372f65cde1eb7.emf)

GroundFuel – Activity fuels (residues) on the ground, GT/ac

PiledFuel – Piled activity fuels (residues), GT/ac

GroundFuel =ResidueLLT+ResidueST\*(1-ResidueRecovFracWT)

$$
GroundFuel = ResidueLLT + ResidueST \times (1 - ResidueRecovFracWT)
$$

ResidueLLT not times 1-ResidueRecovFracWT???

#### Amounts Unrecovered and Left at the Landing

![](media/18a4aafbe937446e8163c2dd76dddc5a.emf)

PiledFuel=IF(CalcResidues=1,0,ResidueSLT\*ResidueRecovFracWT)

No LLT residue Piled?

TotalResidues

=ResidueRecoveredPrimary+ResidueRecoveredOptional+ResidueUncutTrees+GroundFuel+PiledFuel

$$
PiledFuel = ResidueSLT \times ResidueRecovFracWT
$$

$$
TotalResidues = ResidueRecoveredPrimary + ResidueRecoveredOptional + ResidueUncutTrees + GroundFuel + PiledFuel
$$

### System Cost Elements

#### For Primary Products (boles & WT residues), \$/CCF of material treated by the activity

![](media/df0885ec8dbbe505a51755151dfc4d9e.emf)

#### For Optional Residues, \$/GT of additional residue recovered

![](media/a84def4955b497d38500adcba67d1ccf.emf)

Chip Loose Residues: from log trees \<=80 cf

=CostChipLooseRes\*CollectOption\*InLimits1

Residue Move-In Costs, \$/GT = =0\*CalcMoveIn\*CalcResidues\*InLimits1

What is the point of residue move-in costs?

#### For All Products, \$/ac

![](media/380f74bb5463e43f1443fccaaa00c867.emf)

Stump2Truck4PrimaryProductWithoutMovein=FellAndBunchTreesLess80cf+ManualFellLimbBuckTreesLarger80cf+SkidBunchedAllTrees+ProcessLogTreesLess80cf+LoadLogTrees+ChipWholeTrees

Movein4PrimaryProduct=MoveInCosts!G39\*CalcMoveIn\*BoleVol\*InLimits1

OntoTruck4ResiduesWoMovein=ChipLooseResiduesFromLogTreesLess80cf==CostChipLooseRes\*CalcResidues\*ResidueRecoveredOptional\*InLimits1

Movein4Residues==0\*CalcMoveInOption\*CollectOption\*ResidueRecoveredOptional\*InLimits1

### System Cost Summaries

TotalPerAcre=Stump2Truck4PrimaryProductWithoutMovein+Movein4PrimaryProduct+OntoTruck4ResiduesWoMovein+Movein4Residues

TotalPerBoleCCF=TotalPerAcre/BoleVol

TotalPerGT=TotalPerAcre/TotalPrimaryProductsAndOptionalResidues

### Limits

![](media/e6ac1a466248d6940a8a5dc2ca280b85.emf)

ExceededMaxTreeVol (0=no,1=yes)

=IF(OR(TreeVolCT\>AvgTreeSizeLimit4Chipping,TreeVolSLT\>AvgTreeSizeLimit4Processing,TreeVolLLT\>AvgTreeSizeLimit4ManualFellLimbBuck,TreeVolALT\>AvgTreeSizeLimit4loading,TreeVol\>AvgTreeSize4GrappleSkidding),1,0)

ExceededMaxSkidSlope (0=no, 1=yes) = =IF(Slope\>SkiddingLimit,1,0)

InLimits1=IF(OR(ExceededMaxLLT=1,ExceededMaxTreeVol=1,ExceededMaxSkidSlope=1,ExceededMaxYardingDist=1),NA(),1)
