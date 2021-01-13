#pragma once

#include <ac-library/http/handler/handler.hpp>
#include <request.hpp>

namespace NMyNS {
    class TBaseHandler : public NAC::NHTTPHandler::THandler {
    public:
        virtual void Handle(
            const std::shared_ptr<TRequest> request,
            const std::vector<std::string>& args
        ) = 0;

        void Handle(
            const std::shared_ptr<NAC::NHTTP::TRequest> request,
            const std::vector<std::string>& args
        ) override {
            Handle(std::shared_ptr<TRequest>(request, (TRequest*)request.get()), args);
        }
    };
}
