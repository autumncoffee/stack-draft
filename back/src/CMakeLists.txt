project(back)

cmake_minimum_required(VERSION 3.10)

if (${CMAKE_SYSTEM_NAME} MATCHES "Darwin")
    set(MY_BACK_EXTRA_CXX_FLAGS "-stdlib=libc++")
    set(MY_BACK_EXTRA_LIBS "-lstdc++" "-lc++experimental")

else()
    set(MY_BACK_EXTRA_CXX_FLAGS "")
    set(MY_BACK_EXTRA_LIBS "-lstdc++fs")
endif()

set(MY_COMMON_CXX_FLAGS "-std=c++17 ${MY_BACK_EXTRA_CXX_FLAGS}")
set(MY_TCMALLOC_CXX_FLAGS "-fno-builtin-malloc -fno-builtin-calloc -fno-builtin-realloc -fno-builtin-free")
set(MY_DEBUG_CXX_FLAGS "")
set(MY_TCMALLOC_LIBS "-ltcmalloc")

if("$ENV{IS_DEV}" STREQUAL "1")
    set(MY_TCMALLOC_CXX_FLAGS "")
    set(MY_DEBUG_CXX_FLAGS "-g")
    set(MY_TCMALLOC_LIBS "")

    set(CMAKE_EXE_LINKER_FLAGS "-g -Wl,-no_pie -fsanitize=address ${CMAKE_EXE_LINKER_FLAGS}")
    add_compile_options("-fsanitize=address")

else()
    add_compile_options("-O3")
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_FLAGS "${MY_COMMON_CXX_FLAGS} ${MY_TCMALLOC_CXX_FLAGS} ${MY_DEBUG_CXX_FLAGS} ${CMAKE_CXX_FLAGS}")

file(GLOB MY_BACK_SOURCES *.cpp)

include_directories("../ac")
include_directories("../contrib")
include_directories(".")

add_subdirectory("handlers")

add_subdirectory("../ac/ac-common" ac_common_bindir)
add_subdirectory("../ac/ac-library/http" ac_library_http_bindir)
add_subdirectory("../ac/ac-library/containers/persistent/immutable_hashmap" ac_library_persistent_immutable_hashmap_bindir)
add_subdirectory("../ac/ac-library/containers/persistent/binary_heap" ac_library_persistent_binary_heap_bindir)
add_subdirectory("../ac/ac-library/containers/rbtree" ac_library_rbtree_bindir)

add_executable(back ${MY_BACK_SOURCES})

target_link_libraries(
    back
    back_handlers
    ac_common
    ac_library_http
    ac_library_http_router
    ac_library_persistent_immutable_hashmap
    ac_library_persistent_binary_heap
    ac_library_rbtree
    ${MY_TCMALLOC_LIBS}
    ${MY_BACK_EXTRA_LIBS}
)

install(TARGETS back RUNTIME DESTINATION bin)
