# npm distribution

Keep the existing workspace package names and public core imports for source compatibility. Mark the source manifests private. A dedicated pack script stages the built files under the user's npm scope as `trellis-lite` and `trellis-lite-core`, pins the CLI's core dependency through an npm alias, and copies source files and the license. This separates published identity from workspace imports without rewriting application behavior.

Publish the core tarball first, then the CLI, with public access. The published CLI retains `trellis` and `tl`. Source checkout upgrades retain their existing instructions; installed npm packages show their own upgrade command. GitHub publishing must use prepared Lite tarballs rather than the upstream workspace names.

Verify package contents, public export/type resolution, and installation into a clean temporary prefix before considering publication complete. npm login and any account verification must be performed by the user. Actual publication is authorized by the current request.
