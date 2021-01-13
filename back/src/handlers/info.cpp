#include "info.hpp"
#include <ac-library/containers/persistent/immutable_hashmap/hashmap.hpp>
#include <stdlib.h>
#include <fs_wrapper.hpp>
#include <ac-common/utils/string.hpp>

namespace NMyNS {
    void TInfoHandler::Handle(
        const std::shared_ptr<TRequest> request,
        const std::vector<std::string>& args
    ) {
        if (args.size() != 1) {
            request->Send400();
            return;
        }

        const char* root = getenv("ROOT");

        if (!root) {
            request->Send500();
            return;
        }

        const auto dataPath = stdfs::path(root) / "data" / "example.hashmap";
        NAC::TPersistentImmutableHashMap hm(dataPath.string(), NAC::TPersistentImmutableHashMap::DefaultSeed);

        if (!hm) {
            request->Send500();
            return;
        }

        uint64_t id;
        NAC::NStringUtils::FromString(args.at(0), id);

        const auto value = hm.Get(id);

        if (!value) {
            request->Send404();
            return;
        }

        nlohmann::json out;
        out["id"] = id;
        out["msg"] = (std::string)value;

        request->SendJson(out);
    }
}
