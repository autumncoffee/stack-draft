#pragma once

#include "base.hpp"

namespace NMyNS {
    class TInfoHandler : public TBaseHandler {
    public:
        void Handle(
            const std::shared_ptr<TRequest> request,
            const std::vector<std::string>& args
        ) override;
    };
}
