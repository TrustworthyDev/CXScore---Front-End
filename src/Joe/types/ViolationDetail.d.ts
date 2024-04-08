type CXSKeyboardAccessibleDetail = {
  input: {
    is_tab_order_available: boolean;
    tab_order: ElementDetail[];
  };
  output: ElementDetail;
  intermediate: {
    inorder_interactables: ElementDetail[];
  };
};

type CXSFocusOrderDetail = {
  input: {
    is_tab_order_available: boolean;
    tab_order: ElementDetail[];
  };
  output: {
    destination: ElementDetail;
    source: ElementDetail;
  };
};

type CXSKeyboardTrapDetail = {
  input: {
    is_tab_order_available: boolean;
    tab_order: ElementDetail[];
  };
  output: IndexedElementDetail[];
  intermediate: {
    preorder_interactables: ElementDetail[];
  };
};

type CXSFocusVisibleDetail = {
  path: string;
  selector: string;
  bounds: Rectangle;
  minimalAreaViolation: boolean;
  contrastViolation: boolean;
  severity: string;
  message: string;
  noFocusImage: string;
  focusImage: string;
  dilatedImage: string;
  maskedImage: string;
  diffImage: string;
  pixelRatio: number;
  colorContrast: number;
  backgroundColor: string;
  indicatorColor: string;
};
