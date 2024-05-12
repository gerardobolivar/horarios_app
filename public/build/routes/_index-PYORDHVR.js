import {
  require_node
} from "/build/_shared/chunk-G7CHZRZX.js";
import {
  Link,
  init_dist2 as init_dist
} from "/build/_shared/chunk-KDD6VS37.js";
import "/build/_shared/chunk-U4FRFQSK.js";
import {
  require_jsx_dev_runtime
} from "/build/_shared/chunk-XGOTYLZ5.js";
import {
  createHotContext
} from "/build/_shared/chunk-VTV3NSO3.js";
import "/build/_shared/chunk-UWV35TSL.js";
import "/build/_shared/chunk-7M6SC7J5.js";
import {
  __toESM
} from "/build/_shared/chunk-PNG5AS42.js";

// app/routes/_index.tsx
var import_node = __toESM(require_node(), 1);

// App/old-app/Components/MainTitle.js
var import_jsx_dev_runtime = __toESM(require_jsx_dev_runtime(), 1);
function MainTitle({ innerText = "Test" }) {
  const title = innerText;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime.jsxDEV)("h1", { className: "mainTitle", children: title }, void 0, false, {
    fileName: "App/old-app/Components/MainTitle.js",
    lineNumber: 4,
    columnNumber: 5
  }, this);
}

// App/old-app/Components/CicleCard.js
init_dist();
var import_jsx_dev_runtime2 = __toESM(require_jsx_dev_runtime(), 1);
function CicleCard(props) {
  let title = props.innerText;
  let href = props.url;
  let isActive = props.active;
  return /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)(Link, { to: href, className: !isActive ? "disableLink noDecoration" : "noDecoration", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "card cicleCard", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("div", { className: "card-body", children: /* @__PURE__ */ (0, import_jsx_dev_runtime2.jsxDEV)("h5", { className: "card-title", children: title }, void 0, false, {
    fileName: "App/old-app/Components/CicleCard.js",
    lineNumber: 11,
    columnNumber: 11
  }, this) }, void 0, false, {
    fileName: "App/old-app/Components/CicleCard.js",
    lineNumber: 10,
    columnNumber: 9
  }, this) }, void 0, false, {
    fileName: "App/old-app/Components/CicleCard.js",
    lineNumber: 9,
    columnNumber: 7
  }, this) }, void 0, false, {
    fileName: "App/old-app/Components/CicleCard.js",
    lineNumber: 8,
    columnNumber: 5
  }, this);
}

// App/old-app/views/admin/home.js
var import_jsx_dev_runtime3 = __toESM(require_jsx_dev_runtime(), 1);
function HomeAdmin() {
  return /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "", children: [
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(MainTitle, { innerText: "Horarios" }, void 0, false, {
      fileName: "App/old-app/views/admin/home.js",
      lineNumber: 7,
      columnNumber: 5
    }, this),
    /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)("div", { className: "Panel d-flex justify-content-around", children: [
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(CicleCard, { innerText: "Ciclo I", url: "form", active: false }, void 0, false, {
        fileName: "App/old-app/views/admin/home.js",
        lineNumber: 9,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(CicleCard, { innerText: "Ciclo II", url: "horario", active: false }, void 0, false, {
        fileName: "App/old-app/views/admin/home.js",
        lineNumber: 10,
        columnNumber: 7
      }, this),
      /* @__PURE__ */ (0, import_jsx_dev_runtime3.jsxDEV)(CicleCard, { innerText: "Ciclo III", url: "form", active: true }, void 0, false, {
        fileName: "App/old-app/views/admin/home.js",
        lineNumber: 11,
        columnNumber: 7
      }, this)
    ] }, void 0, true, {
      fileName: "App/old-app/views/admin/home.js",
      lineNumber: 8,
      columnNumber: 5
    }, this)
  ] }, void 0, true, {
    fileName: "App/old-app/views/admin/home.js",
    lineNumber: 6,
    columnNumber: 3
  }, this);
}

// app/routes/_index.tsx
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\routes\\_index.tsx"
  );
  import.meta.hot.lastModified = "1715555006382.1504";
}
export {
  HomeAdmin as default
};
//# sourceMappingURL=/build/routes/_index-PYORDHVR.js.map
