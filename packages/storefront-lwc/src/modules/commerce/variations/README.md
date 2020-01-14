# Variations component

This component contains the product variations and qty field.
The qty feild is currently set to 10 (TODO: should be capped at ats level)

It sends messages to the product details component (parent)
when the qty has been changed (with the event updateSelectQty), then an event will be sent to the component productAvailabilty.

