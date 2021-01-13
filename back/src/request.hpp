#pragma once

#include <ac-library/http/request.hpp>
#include <json.hh>
#include <utility>
#include <memory>

namespace NMyNS {
    class TRequest : public NAC::NHTTP::TRequest {
    public:
        using NAC::NHTTP::TRequest::TRequest;

        const nlohmann::json& Json();

        NAC::NHTTP::TResponse RespondJson(const nlohmann::json& data) const {
            auto response = Respond200();

            response.Header("Content-Type", "application/json");
            response.Write(data.dump());

            return response;
        }

        template<typename... TArgs>
        void SendJson(TArgs&&... args) {
            Send(RespondJson(std::forward<TArgs>(args)...));
        }

    private:
        std::unique_ptr<nlohmann::json> Json_;
    };
}
