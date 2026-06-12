# agents/router_agent.py

def route_document(doc_type):

    routes = {
        "Resume": "HR",
        "Invoice": "Finance",
        "Contract": "Legal",
        "Purchase Order": "Procurement",
        "Medical Report": "Healthcare",
        "Passport": "Identity Verification",
        "Bank Statement": "Finance"
    }

    return routes.get(
        doc_type,
        "Manual Review"
    )