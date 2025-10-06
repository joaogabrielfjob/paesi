package constants

type OrderStatus string

const (
	OrderStatusCreated         OrderStatus = "CREATED"
	OrderStatusConfirmed       OrderStatus = "CONFIRMED"
	OrderStatusInDeliveryRoute OrderStatus = "IN_DELIVERY_ROUTE"
	OrderStatusFinished        OrderStatus = "FINISHED"
	OrderStatusCanceled        OrderStatus = "CANCELED"
)
