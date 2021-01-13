#include "request.hpp"

#include <handlers/info.hpp>
#include <handlers/index.hpp>

#include <ac-library/http/server/server.hpp>
#include <ac-library/http/server/client.hpp>
#include <ac-library/http/router/router.hpp>

#include <ac-common/utils/string.hpp>

#include <stdlib.h>

int main() {
    auto apiRouter = std::make_shared<NAC::NHTTPRouter::TRouter>();
    apiRouter->Add("^info/([0-9]+)/*$", std::make_shared<NMyNS::TInfoHandler>());

    NAC::NHTTPRouter::TRouter router;
    router.Add("^/api/", apiRouter);
    router.Add("^/", std::make_shared<NMyNS::TIndexHandler>());

    NAC::NHTTPServer::TServer::TArgs args;

    args.BindIP4 = getenv("BIND_V4");
    args.BindIP6 = getenv("BIND_V6");

    args.BindPort4 = NAC::NStringUtils::FromString<unsigned short>(getenv("BIND_PORT"));
    args.BindPort6 = args.BindPort4;

    args.ThreadCount = 10;

    // This is needed to use custom request class
    args.ClientArgsFactory = [&router]() {
        return new NAC::NHTTPServer::TClient::TArgs(router, [](
            std::shared_ptr<NAC::NHTTPLikeParser::TParsedData> data,
            const NAC::NHTTPServer::TResponder& responder
        ) {
            return (NAC::NHTTP::TRequest*)(new NMyNS::TRequest(data, responder));
        });
    };

    NAC::NHTTPServer::TServer(args, router).Run();

    return 0;
}
