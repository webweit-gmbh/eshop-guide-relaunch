class PasswordModal extends DetailsModal {
	constructor() {
		super();
		if (this.querySelector('input[aria-invalid="true"]'))
			this.open({ target: this.querySelector("details") });
		this.closeBtn = this.querySelector(".modal__close-button");
		const $this = this;
		this.closeBtn.addEventListener("click", () => {
			$this.close(true);
		});
	}
}

customElements.define("password-modal", PasswordModal);
