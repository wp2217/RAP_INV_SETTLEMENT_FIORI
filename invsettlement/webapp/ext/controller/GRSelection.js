sap.ui.define([
    "sap/m/Dialog",
    "sap/m/Button",
    "sap/m/Input",
    "sap/m/Label",
    "sap/m/VBox",
    "sap/m/HBox",
    "sap/m/Table",
    "sap/m/Column",
    "sap/m/ColumnListItem",
    "sap/m/Text",
    "sap/m/DatePicker",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
], function (
    Dialog,
    Button,
    Input,
    Label,
    VBox,
    HBox,
    Table,
    Column,
    ColumnListItem,
    Text,
    DatePicker,
    MessageToast,
    MessageBox,
    JSONModel
) {
    "use strict";

    let oDialog;
    let oTable;
    let oHeaderContext;

    return {

        open: function (oContext) {

            oHeaderContext = oContext;

            if (oDialog) {
                oDialog.destroy();
                oDialog = null;
            }

            // 查询条件 Model
            const oConditionModel = new JSONModel({
                EBELN: "",
                MATNR: "",
                WERKS: "",
                LIFNR: "",
                BUDAT: ""
            });

            // 查询结果 Model
            const oResultModel = new JSONModel({
                items: []
            });

            // 查询条件输入框
            const oPOInput = new Input({
                value: "{condition>/EBELN}",
                placeholder: "请输入 PO Number"
            });

            const oMaterialInput = new Input({
                value: "{condition>/MATNR}",
                placeholder: "请输入 Material"
            });

            const oPlantInput = new Input({
                value: "{condition>/WERKS}",
                placeholder: "请输入 Plant"
            });

            const oVendorInput = new Input({
                value: "{condition>/LIFNR}",
                placeholder: "请输入 Vendor"
            });

            const oDateInput = new DatePicker({
                value: "{condition>/BUDAT}",
                valueFormat: "yyyy-MM-dd",
                displayFormat: "yyyy-MM-dd",
                placeholder: "Posting Date"
            });

            // 查询条件区域
            const oSearchArea = new VBox({
                items: [
                    new HBox({
                        items: [
                            new VBox({
                                width: "50%",
                                items: [
                                    new Label({ text: "PO Number" }),
                                    oPOInput
                                ]
                            }),
                            new VBox({
                                width: "50%",
                                items: [
                                    new Label({ text: "Material" }),
                                    oMaterialInput
                                ]
                            })
                        ]
                    }),
                    new HBox({
                        items: [
                            new VBox({
                                width: "50%",
                                items: [
                                    new Label({ text: "Plant" }),
                                    oPlantInput
                                ]
                            }),
                            new VBox({
                                width: "50%",
                                items: [
                                    new Label({ text: "Vendor" }),
                                    oVendorInput
                                ]
                            })
                        ]
                    }),
                    new VBox({
                        items: [
                            new Label({ text: "Posting Date" }),
                            oDateInput
                        ]
                    })
                ]
            });

            // GR 查询结果 Table
            oTable = new Table({
                mode: "MultiSelect",
                includeItemInSelection: true,
                columns: [
                    new Column({ header: new Text({ text: "Material Document" }) }),
                    new Column({ header: new Text({ text: "Item" }) }),
                    new Column({ header: new Text({ text: "PO" }) }),
                    new Column({ header: new Text({ text: "Material" }) }),
                    new Column({ header: new Text({ text: "Plant" }) }),
                    new Column({ header: new Text({ text: "Quantity" }) })
                ]
            });

            oTable.setModel(oResultModel, "result");

            oTable.bindItems({
                path: "result>/items",
                template: new ColumnListItem({
                    cells: [
                        new Text({ text: "{result>MBLNR}" }),
                        new Text({ text: "{result>MJAHR}" }),
                        new Text({ text: "{result>EBELN}" }),
                        new Text({ text: "{result>MATNR}" }),
                        new Text({ text: "{result>WERKS}" }),
                        new Text({ text: "{result>MENGE}" })
                    ]
                })
            });

            oDialog = new Dialog({
                title: "Select GR Items",
                contentWidth: "1000px",
                contentHeight: "650px",
                resizable: true,
                draggable: true,

                content: [
                    new VBox({
                        width: "100%",
                        items: [
                            oSearchArea,
                            new HBox({
                                justifyContent: "End",
                                items: [
                                    new Button({
                                        text: "Search",
                                        type: "Emphasized",
                                        press: function () {
                                            this._searchGR(
                                                oConditionModel,
                                                oResultModel
                                            );
                                        }.bind(this)
                                    })
                                ]
                            }),
                            oTable
                        ]
                    })
                ],

                beginButton: new Button({
                    text: "Confirm",
                    type: "Emphasized",
                    press: function () {
                        this._confirmGR();
                    }.bind(this)
                }),

                endButton: new Button({
                    text: "Cancel",
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            oDialog.setModel(oConditionModel, "condition");
            oDialog.setModel(oResultModel, "result");

            oDialog.open();

            this._searchGR = this._searchGR.bind(this);
            this._confirmGR = this._confirmGR.bind(this);
        },

        // 查询 GR
        _searchGR: async function (oConditionModel, oResultModel) {

            const oCondition = oConditionModel.getData();

            // TODO: 调用 RAP OData V4 查询接口
            // 这里先使用模拟数据验证前端弹窗和选择功能

            oResultModel.setData({
                items: [
                    {
                        MBLNR: "5000000010",
                        MJAHR: "2026",
                        EBELN: "4500000010",
                        MATNR: "MAT001",
                        WERKS: "1010",
                        MENGE: "100"
                    },
                    {
                        MBLNR: "5000000011",
                        MJAHR: "2026",
                        EBELN: "4500000010",
                        MATNR: "MAT002",
                        WERKS: "1010",
                        MENGE: "200"
                    }
                ]
            });

            MessageToast.show("GR 查询完成");
        },

        // 确认选择
        _confirmGR: async function () {

            const aSelectedItems = oTable.getSelectedItems();

            if (!aSelectedItems.length) {
                MessageToast.show("请至少选择一条 GR Item");
                return;
            }

            // 1. 获取选中的 GR 数据
            const aSelectedGR = aSelectedItems.map(function (oItem) {
                return oItem
                    .getBindingContext("result")
                    .getObject();
            });

            // 2. 转换为 RAP Action 接收的结构
           // const aPayload = aSelectedGR.map(function (oGR) {
           //     return {
           //         MBLNR: oGR.MaterialDocument,
           //         MJAHR: oGR.MaterialDocumentYear,
           //         ZEILE: oGR.MaterialDocumentItem,
           //         EBELN: oGR.PurchaseOrder,
           //         EBELP: oGR.PurchaseOrderItem,
           //         MATNR: oGR.Material,
           //         WERKS: oGR.Plant,
           //         MENGE: String(oGR.QuantityInEntryUnit),
           //         MEINS: oGR.EntryUnit
           //     };
           // });

            try {
                // 3. 获取当前 Header Draft Context
                const oModel = oHeaderContext.getModel();
                // 4. 创建 Header 绑定 Action
                const oAction = oModel.bindContext(
                    "com.sap.gateway.srvd.zs_roc_inv_manage.v0001.addGRItems(...)",
                    oHeaderContext
                );
                // 5. 传递 JSON 参数
                oAction.setParameter(
                    "SelectedGRJson",
                    JSON.stringify(aSelectedGR)
                );
                // 6. 执行 RAP Action
                await oAction.invoke("$auto");
                // 7. 刷新当前 Header 下的 Item 数据
                await oHeaderContext.requestSideEffects([
                    {
                        $NavigationPropertyPath: "_invItem"
                    }
                ]);
                // 8. 关闭 Dialog
                oDialog.close();
                MessageToast.show(
                    "成功添加 " + aSelectedGR.length + " 条 GR Item"
                );
            } catch (oError) {
                console.error("addGRItems Error:", oError);
                MessageBox.error(
                    "添加 GR Item 失败：" + oError.message
                );
            }
        }
    };
});