sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"com/roc/invsettlement/test/integration/pages/ZC_ROC_INV_SET_HList.gen",
	"com/roc/invsettlement/test/integration/pages/ZC_ROC_INV_SET_HObjectPage.gen",
	"com/roc/invsettlement/test/integration/pages/ZC_ROC_INV_SET_IObjectPage.gen"
], function (JourneyRunner, ZC_ROC_INV_SET_HListGenerated, ZC_ROC_INV_SET_HObjectPageGenerated, ZC_ROC_INV_SET_IObjectPageGenerated) {
    'use strict';

    const runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('com/roc/invsettlement') + '/test/flp.html#app-preview',
        pages: {
			onTheZC_ROC_INV_SET_HListGenerated: ZC_ROC_INV_SET_HListGenerated,
			onTheZC_ROC_INV_SET_HObjectPageGenerated: ZC_ROC_INV_SET_HObjectPageGenerated,
			onTheZC_ROC_INV_SET_IObjectPageGenerated: ZC_ROC_INV_SET_IObjectPageGenerated
        },
        async: true
    });

    return runner;
});

