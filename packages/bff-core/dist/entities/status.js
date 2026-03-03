"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
var Status;
(function (Status) {
    Status["PENDING_PAYMENT"] = "Pago pendiente";
    Status["PROCESSING_PAYMENT"] = "Procesando pago";
    Status["APPROVED_PAYMENT"] = "Pago aprobado";
    Status["INCOMPLETE_PAYMENT"] = "Pago inconcluso";
    Status["CANCELED"] = "Cancelado";
    Status["DISPATCHED"] = "Despachado";
})(Status || (exports.Status = Status = {}));
