#include "index.hpp"

namespace NMyNS {
    void TIndexHandler::Handle(
        const std::shared_ptr<TRequest> request,
        const std::vector<std::string>& args
    ) {
        nlohmann::json out;
        out["msg"] = "Hello from back!";

        request->SendJson(out);
    }
}
