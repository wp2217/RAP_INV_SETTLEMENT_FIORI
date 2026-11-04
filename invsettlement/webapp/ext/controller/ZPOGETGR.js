sap.ui.define([
    "sap/m/MessageToast",
    "./GRSelection"
], function (MessageToast, GRSelection) {
    'use strict';

    return {
        // 控制按钮是否启用
        enabledGetPOGR: function (oContext, aSelectedContexts) {
            if (!oContext) {
                return false;
            }

            const oHeaderData = oContext.getObject();
            if (oHeaderData.SettleType === '01' && oHeaderData.DraftAdministrativeData !== null &&
                oHeaderData.InvoiceNo !== null && oHeaderData.InvoiceNo !== undefined &&
                oHeaderData.Lifnr !== null && oHeaderData.Lifnr !== undefined &&
                oHeaderData.TransactionEvent !== null && oHeaderData.TransactionEvent !== undefined
            ) {
                return true;
            } else {
                return false;
            }

        },
        /**
         * Generated event handler.
         *
         * @param oContext the context of the page on which the event was fired. `undefined` for list report page.
         * @param aSelectedContexts the selected contexts of the table rows.
         */
        triggerGetPOGR: function (oContext, aSelectedContexts) {
            if (!oContext) {
                MessageToast.show("无法获取当前单据上下文");
                return;
            }

            // 获取当前 Header Context
            GRSelection.open(oContext);


        }
    };
});
